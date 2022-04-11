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

	findRes := global.MongoDatabase.Collection(fmt.Sprintf("%vs", sessionData.Capacity)).
		FindOne(context.Background(), bson.M{"id": sessionData.Id})
	findErr := findRes.Err()
	if findErr == mongo.ErrNoDocuments {
		response.Code = types.ResCodeUnauthorized
		response.Message = "no such account in session"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	if findErr != nil {
		response.Code = types.ResCodeErr
		response.Message = "unable connect to redis"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	user := model.ClientUser{}
	decodeErr := findRes.Decode(&user)
	if decodeErr != nil {
		response.Code = types.ResCodeErr
		response.Message = "unable parse to profile"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	responseWithUser := types.GetUserResponseWithUser{}
	responseWithUser.Capacity = sessionData.Capacity
	responseWithUser.Code = types.ResCodeOK
	responseWithUser.Message = "success"
	responseWithUser.User = user
	common.JsonRespond(w, http.StatusOK, &responseWithUser)
}
