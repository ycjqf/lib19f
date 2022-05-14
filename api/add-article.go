package api

import (
	"context"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
	"lib19f/model"
	"lib19f/validators/r2p"
	"net/http"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ApiAddArticle = common.GenPostApi(apiAddArticleHandler)

func apiAddArticleHandler(w http.ResponseWriter, r *http.Request) {
	response := types.AddArticleResponse{}

	sessionData, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, true)
	if !sessionDataSuccess {
		return
	}

	if sessionData.Capacity != "user" {
		response.Code = types.ResCodeUnauthorized
		response.Message = "can only user upload article"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	payload, payloadErr := r2p.AddArticle(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
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
		response.Code = types.ResCodeErr
		response.Message = "can not insert article"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	uploadedDocRes := global.MongoDatabase.Collection("articles").FindOne(context.Background(),
		bson.M{"_id": insertRes.InsertedID})
	uploadedDoc := model.Article{}
	uploadedDocResErr := uploadedDocRes.Decode(&uploadedDoc)
	if uploadedDocResErr != nil {
		response.Code = types.ResCodeErr
		response.Message = "article added but can not get id"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	response.Code = types.ResCodeOK
	response.Message = "article added"
	response.Id = uploadedDoc.Id
	common.JsonRespond(w, http.StatusOK, &response)
}
