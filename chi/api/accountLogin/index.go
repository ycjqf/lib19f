package accountLogin

import (
	"context"
	"encoding/json"
	"fmt"
	"lib19f-go/api/model"
	"lib19f-go/api/shared"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GenApi() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", handler)
	return r
}

func handler(w http.ResponseWriter, r *http.Request) {
	request := Request{}
	response := Response{}
	respond := func(code string, message string) {
		response.Code = code
		response.Message = message
		parsed, _ := json.Marshal(&response)
		w.Write(parsed)
		return
	}

	// check received form syntax error
	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(shared.ResCode_BadRequest, parseRequestErr.Error())
		return
	}
	payload, payloadErr := genPayload(request)
	if payloadErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(shared.ResCode_BadRequest, payloadErr.Error())
		return
	}

	// check account existence
	userId, validateErr := validatePayload(&payload)
	if validateErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(shared.ResCode_BadRequest, validateErr.Error())
		return
	}
	if userId == 0 {
		respond(shared.ResCode_WrongCredential, "wrong password or account not exist")
		return
	}

	// token logic
	rdb := shared.Connections.Rdb
	willUseSessionId, willUseSessionIdEncrypted := shared.GenSesionId(payload.Capacity, userId)
	sessionExistence := rdb.Get(context.Background(), willUseSessionId)
	sessionExistenceErr := sessionExistence.Err()
	// have bad error
	if sessionExistenceErr != nil && sessionExistenceErr != redis.Nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(shared.ResCode_Err, sessionExistenceErr.Error())
		return
	}
	// existed not relog
	if sessionExistenceErr == nil && !payload.Relog {
		respond(shared.ResCode_Logged, "already login")
		return
	}
	// existed and relog
	if sessionExistenceErr == nil && payload.Relog {
		rdb.Del(context.Background(), willUseSessionId)
	}
	// have ok error

	session := http.Cookie{
		Name:     "account_session",
		Value:    willUseSessionIdEncrypted,
		Expires:  time.Now().Add(time.Hour * 3),
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
	}
	rdb.Set(context.Background(), willUseSessionId, payload.Name, time.Hour*3)
	http.SetCookie(w, &session)

	respond(shared.ResCode_OK, "ok")
}

func validatePayload(payload *Payload) (uint32, error) {
	mdb := shared.Connections.Mdb

	var credential primitive.M = bson.M{}

	if payload.Using == "email" {
		credential["email"] = payload.Email
	} else {
		credential["name"] = payload.Name
	}

	existence := mdb.Database(shared.DEFAULT_DATABASE).
		Collection(fmt.Sprintf("%vs", payload.Capacity)).
		FindOne(nil, credential)

	existenceErr := existence.Err()
	// have error(mongo related)
	if existenceErr != nil && existenceErr != mongo.ErrNoDocuments {
		return 0, existenceErr
	}
	// have error(account not exist)
	if existenceErr != nil && existenceErr == mongo.ErrNoDocuments {
		return 0, nil
	}

	// try decode found account
	account := model.User{}
	decodeErr := existence.Decode(&account)
	if decodeErr != nil {
		return 0, decodeErr
	}

	// whether password match
	passwordMatch := shared.DoPasswordsMatch(account.Password, payload.Password)
	if !passwordMatch {
		return 0, nil
	}

	return account.Id, nil
}
