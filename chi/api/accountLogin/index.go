package accountLogin

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"hash/fnv"
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
		respond(shared.BaseCode_BadRequest, parseRequestErr.Error())
		return
	}
	payload, payloadErr := genPayload(request)
	if payloadErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(shared.BaseCode_BadRequest, payloadErr.Error())
		return
	}

	// check account existence
	userId, validateErr := validatePayload(&payload)
	if validateErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(shared.BaseCode_BadRequest, validateErr.Error())
		return
	}
	if userId == 0 {
		respond(Code_WrongCredential, "wrong password or account not exist")
		return
	}

	// token logic
	rdb := shared.Connections.Rdb
	willUseSessionId, willUseSessionIdEncrypted := genSesionId(payload, userId)
	sessionExistence := rdb.Get(context.Background(), willUseSessionId)
	sessionExistenceErr := sessionExistence.Err()
	// have bad error
	if sessionExistenceErr != nil && sessionExistenceErr != redis.Nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(shared.BaseCode_Err, sessionExistenceErr.Error())
		return
	}
	// existed not relog
	if sessionExistenceErr == nil && !payload.Relog {
		respond(Code_Logged, "already login")
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

	respond(shared.BaseCode_OK, "ok")
}

func validatePayload(payload *Payload) (uint32, error) {
	mdb := shared.Connections.Mdb

	var credential primitive.M = bson.M{}
	credential["password"] = payload.Password

	if payload.Using == "email" {
		credential["email"] = payload.Email
	} else {
		credential["name"] = payload.Name
	}

	existence := mdb.Database(shared.DEFAULT_DATABASE).
		Collection(fmt.Sprintf("%vs", payload.Capacity)).
		FindOne(nil, credential)

	existenceErr := existence.Err()
	if existenceErr != nil && existenceErr != mongo.ErrNoDocuments {
		return 0, existenceErr
	}
	if existenceErr != nil && existenceErr == mongo.ErrNoDocuments {
		return 0, nil
	}
	account := model.User{}
	decodeErr := existence.Decode(&account)
	if decodeErr != nil {
		return 0, decodeErr
	}

	return account.Id, nil
}

func genSesionId(payload Payload, id uint32) (string, string) {
	sessionId := fmt.Sprintf("sess-%v-%v-%x", payload.Capacity, id, fnv.New32a().Sum([]byte(payload.Name)))
	encrypted := fmt.Sprintf("%x", sha256.Sum256([]byte(sessionId)))
	return sessionId, encrypted
}
