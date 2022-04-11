package api

import (
	"context"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
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

	payload, payloadErr := r2p.UpdateArticle(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCode_BadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	println("payload:", payload.Id)
	println("sessionData.Id:", sessionData.Id)

	updateRes := global.MongoDatabase.Collection("articles").
		FindOneAndUpdate(context.Background(),
			bson.M{"id": payload.Id, "userId": sessionData.Id},
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
