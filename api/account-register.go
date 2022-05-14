package api

import (
	"context"
	"fmt"
	"hash/fnv"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
	"lib19f/model"
	"lib19f/validators/r2p"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ApiAccountRegister = common.GenPostApi(apiAccountRegisterHandler)

func apiAccountRegisterHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	payload, payloadErr := r2p.AccountRegister(r.Body)
	if payloadErr != nil {
		response.Code = types.ResCodeBadRequest
		response.Message = payloadErr.Error()
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	// whether the account exists
	nameExistence, nameExistenceErr := model.IsKVExist(payload.Capacity, "name", payload.Name)

	if nameExistenceErr != nil {
		response.Code = types.ResCodeErr
		response.Message = nameExistenceErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if nameExistence {
		response.Code = types.ResCodeNameTaken
		response.Message = "name taken"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}
	emailExistence, emailExistenceErr := model.IsKVExist(payload.Capacity, "email", payload.Email)

	if emailExistenceErr != nil {
		response.Code = types.ResCodeErr
		response.Message = emailExistenceErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if emailExistence {
		response.Code = types.ResCodeEmailTaken
		response.Message = "email taken"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}

	// try to save
	saveErr := savePayload(payload)
	if saveErr != nil {
		response.Code = types.ResCodeErr
		response.Message = saveErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	// try save here
	response.Code = types.ResCodeOK
	response.Message = "ok"
	common.JsonRespond(w, http.StatusOK, &response)
}

func savePayload(payload *types.AccountRegisterPayload) error {
	mdb := global.MongoDatabase
	password, passwordErr := common.EncryptPassword(payload.Password)
	if passwordErr != nil {
		return passwordErr
	}
	user := model.User{
		Mid:          primitive.NewObjectID(),
		Id:           genUserId(payload),
		Name:         payload.Name,
		Email:        payload.Email,
		Password:     password,
		CreatedTime:  primitive.NewDateTimeFromTime(time.Now()),
		UpdatedTime:  primitive.NewDateTimeFromTime(time.Now()),
		Gender:       "unset",
		Avatar:       "",
		Introduction: "",
		VersionKey:   0,
	}
	insertRes, insertErr := mdb.Collection(fmt.Sprintf("%vs", payload.Capacity)).
		InsertOne(context.Background(), &user)
	if insertErr != nil {
		return insertErr
	}
	fmt.Printf("%v\n", insertRes)
	return nil
}

func genUserId(payload *types.AccountRegisterPayload) uint32 {
	s := fmt.Sprintf("%v-%d", payload.Name, time.Now())
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}
