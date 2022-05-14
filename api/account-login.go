package api

import (
	"context"
	"encoding/json"
	"fmt"
	"lib19f/api/common"
	"lib19f/api/session"
	"lib19f/api/types"
	"lib19f/config"
	"lib19f/global"
	"lib19f/model"
	"lib19f/validators/r2p"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var ApiAccountLogin = common.GenPostApi(apiAccountLoginHandler)

func apiAccountLoginHandler(w http.ResponseWriter, r *http.Request) {
	response := types.AccountLoginResponse{}

	payload, payloadErr := r2p.AccountLogin(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	// check account existence
	userId, validateErr := checkAccountExistence(payload)
	if validateErr != nil {
		response.Code = types.ResCodeErr
		response.Message = validateErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if userId == 0 {
		response.Code = types.ResCodeWrongCredential
		response.Message = "wrong password or account not exist"
		common.JsonRespond(w, http.StatusOK, response)
		return
	}

	// token logic
	rdb := global.RedisClient
	willUseSessionId := session.GenerateSessionId(payload.Capacity, userId)
	sessionIdPrefix := session.GenerateSessionIdPrefix(payload.Capacity, userId)
	sessionExistence := rdb.Keys(context.Background(), fmt.Sprintf("%v*", sessionIdPrefix))
	sessionExistenceErr := sessionExistence.Err()

	// have error
	if sessionExistenceErr != nil {
		response.Code = types.ResCodeErr
		response.Message = sessionExistenceErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	// exist and not attemp to relog
	if len(sessionExistence.Val()) != 0 && !payload.Relog {
		response.Code = types.ResCodeLogged
		response.Message = "already logged in"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}
	// exist and attemp to relog
	if len(sessionExistence.Val()) != 0 && payload.Relog {
		for _, sessionId := range sessionExistence.Val() {
			rdb.Del(context.Background(), sessionId)
		}
	}
	// not exist
	session := http.Cookie{
		Name:     "account_session",
		Value:    willUseSessionId,
		Expires:  time.Now().Add(config.LOGIN_EXPIRATION),
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
	}
	sessionData := types.SessionData{
		Id:           userId,
		Capacity:     payload.Capacity,
		LoginTime:    time.Now().String(),
		UpdatedTime:  time.Now().String(),
		Expiration:   config.LOGIN_EXPIRATION,
		ReauthedTime: 0,
	}
	js, _ := json.Marshal(sessionData)
	rdb.Set(context.Background(), willUseSessionId, js, config.LOGIN_EXPIRATION)
	http.SetCookie(w, &session)

	response.Code = types.ResCodeOK
	response.Message = "ok"
	response.Capacity = sessionData.Capacity
	response.Id = sessionData.Id
	common.JsonRespond(w, http.StatusOK, &response)
}

func checkAccountExistence(payload *types.AccountLoginPayload) (uint32, error) {
	mdb := global.MongoDatabase

	var credential primitive.M = bson.M{}

	if payload.Using == "email" {
		credential["email"] = payload.Email
	} else {
		credential["name"] = payload.Name
	}

	existence := mdb.
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
