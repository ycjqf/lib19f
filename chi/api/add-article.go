package api

import (
	"context"
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/global"
	"lib19f-go/model"
	"lib19f-go/validators/r2p"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ApiAddArticle = common.GenPostApi(apiAddArticleHandler)

func apiAddArticleHandler(w http.ResponseWriter, r *http.Request) {
	response := types.AddArticleResponse{}
	sessionData := types.SessionData{}

	gotSessioCookie, gotSessioCookieErr := r.Cookie("account_session")
	if gotSessioCookieErr == http.ErrNoCookie {
		response.Code = types.ResCode_Unauthorized
		response.Message = "you are not logged in"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	getSessionDataRes := global.RedisClient.Get(context.Background(), gotSessioCookie.Value)
	getSessionDataResErr := getSessionDataRes.Err()
	if getSessionDataResErr == redis.Nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "your credential is outdated"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	if getSessionDataResErr != nil {
		response.Code = types.ResCode_Err
		response.Message = "can not get session data"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	parseErr := json.Unmarshal([]byte(getSessionDataRes.Val()), &sessionData)
	if parseErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "session data is corrupted"
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

	insertRes, insertResErr := global.MongoDatabase.
		Collection("articles").InsertOne(context.Background(), &article)
	if insertResErr != nil {
		response.Code = types.ResCode_Err
		response.Message = "can not insert article"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	uploadedDocRes := global.MongoDatabase.Collection("articles").FindOne(context.Background(),
		bson.M{"_id": insertRes.InsertedID})
	uploadedDoc := model.Article{}
	uploadedDocResErr := uploadedDocRes.Decode(&uploadedDoc)
	if uploadedDocResErr != nil {
		response.Code = types.ResCode_OK
		response.Message = "article added but can not get id"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	response.Code = types.ResCode_OK
	response.Message = "article added"
	response.Id = uploadedDoc.Id
	common.JsonRespond(w, http.StatusUnauthorized, &response)
}
