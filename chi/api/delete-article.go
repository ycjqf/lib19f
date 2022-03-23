package api

import (
	"context"
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/global"
	"lib19f-go/validators/r2p"
	"net/http"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var DeleteArticle = common.GenPostApi(apiDeleteArticle)

func apiDeleteArticle(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	sessionData := types.SessionData{}

	gotSessioCookie, gotSessioCookieErr := r.Cookie("account_session")
	if gotSessioCookieErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "no cookie found in request"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	getSessionDataRes := global.RedisClient.Get(context.Background(), gotSessioCookie.Value)
	getSessionDataResErr := getSessionDataRes.Err()
	if getSessionDataResErr == redis.Nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "you need to login first to upload an article"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	if getSessionDataResErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "can not get session data, you may need to log in again"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	parseErr := json.Unmarshal([]byte(getSessionDataRes.Val()), &sessionData)
	if parseErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "can not parse session data"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	payload, payloadErr := r2p.DeleteCommon(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCode_BadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	deleteRes := global.MongoDatabase.Collection("articles").
		FindOneAndDelete(context.Background(), bson.M{"id": payload.Id, "userId": sessionData.Id})
	deleteErr := deleteRes.Err()
	if deleteErr == mongo.ErrNoDocuments {
		response.Code = types.ResCode_Unauthorized
		response.Message = "no such article or you are not the owner"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	if deleteErr != nil {
		response.Code = types.ResCode_Err
		response.Message = deleteErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	response.Code = types.ResCode_OK
	response.Message = "ok"
	common.JsonRespond(w, http.StatusOK, &response)
	return
}
