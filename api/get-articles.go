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

var ApiGetArticles = common.GenPostApi(apiGetArticlesHandler)

func apiGetArticlesHandler(w http.ResponseWriter, r *http.Request) {
	response := types.GetArticelsResponse{}
	payload, payloadErr := r2p.GetArticles(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCode_Err
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}
	response.Current = payload.Page
	response.PageSize = payload.PageSize

	pipeline := mongo.Pipeline{
		bson.D{
			{Key: "$skip", Value: (payload.Page - 1) * payload.PageSize},
		},
		bson.D{
			{Key: "$limit", Value: payload.PageSize},
		},
		bson.D{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: "users"},
				{Key: "localField", Value: "userId"},
				{Key: "foreignField", Value: "id"},
				{Key: "as", Value: "user"},
			}},
		},
		bson.D{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$user"},
				{Key: "preserveNullAndEmptyArrays", Value: true},
			}},
		},
	}

	getArticleRes, getArticleErr := global.MongoDatabase.Collection("articles").Aggregate(context.Background(),
		pipeline)
	if getArticleErr != nil {
		response.Code = types.ResCode_Err
		response.Message = getArticleErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	articles := []model.ClientArticle{}
	decodeErr := getArticleRes.All(context.Background(), &articles)
	if decodeErr != nil {
		response.Code = types.ResCode_Err
		response.Message = decodeErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	articlesTotal, articlesTotalErr := global.MongoDatabase.Collection("articles").CountDocuments(context.Background(), bson.M{})
	if articlesTotalErr != nil {
		response.Code = types.ResCode_Err
		response.Message = articlesTotalErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	response.Code = types.ResCode_OK
	response.Message = "ok"
	response.Articles = articles
	response.Total = articlesTotal
	common.JsonRespond(w, http.StatusOK, &response)
}
