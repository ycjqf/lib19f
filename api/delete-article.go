package api

import (
	"context"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
	"lib19f/model"
	"lib19f/validators/r2p"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var ApiDeleteArticle = common.GenPostApi(apiAuthentidateHandler)

func apiDeleteArticle(w http.ResponseWriter, r *http.Request) {
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

	payload, payloadErr := r2p.IdCommon(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	deleteRes := global.MongoDatabase.Collection("articles").
		FindOneAndDelete(context.Background(), bson.M{"id": payload.Id})
	deleteErr := deleteRes.Err()
	if deleteErr == mongo.ErrNoDocuments {
		response.Code = types.ResCodeNotFound
		response.Message = "no such article"
		common.JsonRespond(w, http.StatusNotFound, &response)
		return
	}

	if deleteErr != nil {
		response.Code = types.ResCodeErr
		response.Message = deleteErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	article := model.Article{}

	decodeErr := deleteRes.Decode(&article)
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
