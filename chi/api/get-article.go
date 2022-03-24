package api

import (
	"context"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/global"
	"lib19f-go/model"
	"lib19f-go/validators/r2p"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var ApiGetArticle = common.GenPostApi(apiGetArticleHandler)

func apiGetArticleHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	payload, payloadErr := r2p.IdCommon(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCode_Err
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	getRes := global.MongoDatabase.Collection("articles").
		FindOne(context.Background(), bson.M{"id": payload.Id})
	getErr := getRes.Err()

	if getErr == mongo.ErrNoDocuments {
		response.Code = types.ResCode_NoSuchArticle
		response.Message = "article not found"
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	article := model.Article{}
	decodeErr := getRes.Decode(&article)
	if decodeErr != nil {
		response.Code = types.ResCode_Err
		response.Message = decodeErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	response.Code = types.ResCode_OK
	response.Message = article.Body
	common.JsonRespond(w, http.StatusOK, &response)
}
