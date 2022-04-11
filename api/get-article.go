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
)

var ApiGetArticle = common.GenPostApi(apiGetArticleHandler)

func apiGetArticleHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	payload, payloadErr := r2p.IdCommon(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	pipline := []bson.M{
		{
			"$match": bson.M{ //找到文章
				"id": payload.Id,
			},
		},
		{
			"$lookup": bson.M{
				"from":         "users",
				"localField":   "userId",
				"foreignField": "id",
				"as":           "user",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$user",
				"preserveNullAndEmptyArrays": false,
			},
		},
	}

	getArticleRes, getArticleErr := global.MongoDatabase.Collection("articles").Aggregate(context.Background(), pipline)
	if getArticleErr != nil {
		response.Code = types.ResCodeErr
		response.Message = getArticleErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	articles := []model.ClientArticle{}

	decodeErr := getArticleRes.All(context.Background(), &articles)
	if decodeErr != nil {
		response.Code = types.ResCodeErr
		response.Message = decodeErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if len(articles) == 0 {
		response.Code = types.ResCodeNotFound
		response.Message = "no such article"
		common.JsonRespond(w, http.StatusNotFound, &response)
		return
	}

	responseWithArticle := types.GetArticleResponseWithArticle{}
	responseWithArticle.Code = types.ResCodeOK
	responseWithArticle.Message = "success"
	responseWithArticle.Article = articles[0]
	common.JsonRespond(w, http.StatusOK, &responseWithArticle)
}
