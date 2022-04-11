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

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var ApiUpdateArticle = common.GenPostApi(apiUpdateArticleHandler)

func apiUpdateArticleHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	sessionData, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, true)
	if !sessionDataSuccess {
		return
	}

	if sessionData.Capacity != "user" {
		response.Code = types.ResCodeUnauthorized
		response.Message = "can only user update article"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	payload, payloadErr := r2p.UpdateArticle(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	updateRes := global.MongoDatabase.Collection("articles").
		FindOneAndUpdate(context.Background(),
			bson.M{"id": payload.Id},
			bson.M{
				"$set": bson.M{
					"title":       payload.Article.Title,
					"body":        payload.Article.Body,
					"description": payload.Article.Description,
					"updatedTime": primitive.NewDateTimeFromTime(time.Now()),
				},
				"$inc": bson.M{
					"__v": 1,
				},
			})

	deleteErr := updateRes.Err()
	if deleteErr == mongo.ErrNoDocuments {
		response.Code = types.ResCodeUnauthorized
		response.Message = "no such article"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	if deleteErr != nil {
		response.Code = types.ResCodeErr
		response.Message = deleteErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	article := model.Article{}

	decodeErr := updateRes.Decode(&article)
	if decodeErr != nil {
		response.Code = types.ResCodeErr
		response.Message = decodeErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	if article.UserId != sessionData.Id {
		response.Code = types.ResCodeUnauthorized
		response.Message = "you are not the author of this article"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	response.Code = types.ResCodeOK
	response.Message = "ok"
	common.JsonRespond(w, http.StatusOK, &response)
	return
}
