package accountLogin

import (
	"context"
	"encoding/json"
	"fmt"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/config"
	"lib19f-go/global"
	"lib19f-go/model"
	"lib19f-go/validators/r2p"
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
	response := types.AccountLoginResponse{}
	respond := func(code string, message string) {
		response.Code = code
		response.Message = message
		parsed, _ := json.Marshal(&response)
		w.Write(parsed)
		return
	}

	payload, payloadErr := r2p.AccountLogin(r.Body)
	if payloadErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(common.ResCode_BadRequest, payloadErr.Error())
		return
	}

	// check account existence
	userId, validateErr := validatePayload(payload)
	if validateErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(common.ResCode_BadRequest, validateErr.Error())
		return
	}
	if userId == 0 {
		respond(common.ResCode_WrongCredential, "wrong password or account not exist")
		return
	}

	// token logic
	rdb := global.RedisClient
	willUseSessionId, willUseSessionIdEncrypted := common.GenSesionId(payload.Capacity, userId)
	sessionExistence := rdb.Get(context.Background(), willUseSessionId)
	sessionExistenceErr := sessionExistence.Err()
	// have bad error
	if sessionExistenceErr != nil && sessionExistenceErr != redis.Nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(common.ResCode_Err, sessionExistenceErr.Error())
		return
	}
	// existed not relog
	if sessionExistenceErr == nil && !payload.Relog {
		respond(common.ResCode_Logged, "already login")
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

	respond(common.ResCode_OK, "ok")
}

func validatePayload(payload *types.AccountLoginPayload) (uint32, error) {
	mdb := global.MongoClient

	var credential primitive.M = bson.M{}

	if payload.Using == "email" {
		credential["email"] = payload.Email
	} else {
		credential["name"] = payload.Name
	}

	existence := mdb.Database(config.DEFAULT_DATABASE).
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
	passwordMatch := common.DoPasswordsMatch(account.Password, payload.Password)
	if !passwordMatch {
		return 0, nil
	}

	return account.Id, nil
}
