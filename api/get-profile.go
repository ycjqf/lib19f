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

var ApiGetUser = common.GenPostApi(apiGetUserHandler)

func apiGetUserHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	payload, payloadErr := r2p.IdCommon(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	getRes := global.MongoDatabase.Collection("users").
		FindOne(context.Background(), bson.M{"id": payload.Id})
	getErr := getRes.Err()
	if getErr == mongo.ErrNoDocuments {
		response.Code = types.ResCodeNotFound
		response.Message = "user not exist"
		common.JsonRespond(w, http.StatusNotFound, &response)
		return
	}

	user := model.ClientUser{}
	decodeErr := getRes.Decode(&user)
	if decodeErr != nil {
		response.Code = types.ResCodeErr
		response.Message = decodeErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	responseWithUser := types.GetUserResponseWithUser{}
	responseWithUser.Code = types.ResCodeOK
	responseWithUser.Capacity = "user"
	responseWithUser.Message = "success"
	responseWithUser.User = user
	common.JsonRespond(w, http.StatusOK, &responseWithUser)
}
