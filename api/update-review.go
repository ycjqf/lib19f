package api

import (
	"context"
	"encoding/json"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
	"lib19f/model"
	"lib19f/utils"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var ApiUpdateReview = common.GenPostApi(apiReviewHandler)
var reviewStatus = []string{"published", "rejected", "pending"}

func apiReviewHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	request := types.UpdateReviewRequest{}
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

	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil || !utils.Contains(reviewStatus, request.Status) {
		response.Code = types.ResCodeBadRequest
		response.Message = "bad request"
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	updateRes := global.MongoDatabase.Collection("articles").
		FindOneAndUpdate(context.Background(),
			bson.M{"id": request.Id},
			bson.M{
				"$set": bson.M{
					"status":      request.Status,
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

	response.Code = types.ResCodeOK
	response.Message = "ok"
	common.JsonRespond(w, http.StatusOK, &response)
	return
}
