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

var ApiGetReviews = common.GenPostApi(ApiGetReviewssHandler)

func ApiGetReviewssHandler(w http.ResponseWriter, r *http.Request) {
	response := types.GetArticelsResponse{Articles: []model.ClientArticle{}}
	payload, payloadErr := r2p.GetArticles(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}
	response.Current = payload.Page
	response.PageSize = payload.PageSize

	sessionData, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, true)
	if !sessionDataSuccess {
		return
	}

	if sessionData.Capacity != "reviewer" {
		response.Code = types.ResCodeUnauthorized
		response.Message = "can only reviewer review article"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	pipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.M{
				"status": "pending",
			}},
		},
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
	articlesTotal, articlesTotalErr := global.MongoDatabase.Collection("articles").
		CountDocuments(context.Background(), bson.M{
			"status": "pending",
		})
	if articlesTotalErr != nil {
		response.Code = types.ResCodeErr
		response.Message = articlesTotalErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	response.Code = types.ResCodeOK
	response.Message = "ok"
	response.Articles = articles
	response.Total = articlesTotal
	common.JsonRespond(w, http.StatusOK, &response)
}
