package api

import (
	"context"
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/config"
	"lib19f-go/global"
	"lib19f-go/model"
	"lib19f-go/validators/r2p"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ApiAddArticle = common.GenPostApi(apiAddArticleHandler)

func apiAddArticleHandler(w http.ResponseWriter, r *http.Request) {
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

	payload, payloadErr := r2p.AddArticle(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCode_BadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}
	println(payload.Body)

	article := model.Article{
		Mid:         primitive.NewObjectID(),
		Id:          uuid.New().ID(),
		UserId:      sessionData.Id,
		Title:       payload.Title,
		Description: payload.Description,
		Body:        payload.Body,
		Poster:      "",
		Status:      "pending",
		CreatedTime: primitive.NewDateTimeFromTime(time.Now()),
		UpdatedTime: primitive.NewDateTimeFromTime(time.Now()),
		VersionKey:  0,
	}

	_, insertResErr := global.MongoClient.Database(config.DEFAULT_DATABASE).
		Collection("articles").InsertOne(context.Background(), &article)
	if insertResErr != nil {
		response.Code = types.ResCode_Err
		response.Message = "can not insert article"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	response.Code = types.ResCode_OK
	response.Message = "article added"
	common.JsonRespond(w, http.StatusUnauthorized, &response)
}
