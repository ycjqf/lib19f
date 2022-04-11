package api

import (
	"context"
	"fmt"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
	"lib19f/model"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var ApiAuthenticate = common.GenPostApi(apiAuthentidateHandler)

func apiAuthentidateHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}

	sessionData, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, true)
	if !sessionDataSuccess {
		return
	}

	println(fmt.Sprintf("%vs", sessionData.Capacity))
	println(fmt.Sprintf("%d", sessionData.Id))
	deleteRes := global.MongoDatabase.Collection(fmt.Sprintf("%vs", sessionData.Capacity)).
		FindOne(context.Background(), bson.M{"id": sessionData.Id})
	deleteErr := deleteRes.Err()
	if deleteErr == mongo.ErrNoDocuments {
		response.Code = types.ResCode_Unauthorized
		response.Message = "no such account in session"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	if deleteErr != nil {
		response.Code = types.ResCode_Err
		response.Message = "unable connect to redis"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	user := model.ClientUser{}
	decodeErr := deleteRes.Decode(&user)
	if decodeErr != nil {
		response.Code = types.ResCode_Err
		response.Message = "unable parse to profile"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	responseWithUser := types.GetUserResponseWithUser{}
	responseWithUser.Capacity = sessionData.Capacity
	responseWithUser.Code = types.ResCode_OK
	responseWithUser.Message = "success"
	responseWithUser.User = user
	common.JsonRespond(w, http.StatusOK, &responseWithUser)
}
