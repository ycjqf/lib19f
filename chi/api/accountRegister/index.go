package accountRegister

import (
	"context"
	"encoding/json"
	"fmt"
	"hash/fnv"
	"lib19f-go/api/common"
	"lib19f-go/config"
	"lib19f-go/global"
	"lib19f-go/model"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GenApi() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", handler)
	return r
}

func handler(w http.ResponseWriter, r *http.Request) {
	request := Request{}
	response := Response{}
	respond := func(code string, message string) {
		response.Code = code
		response.Message = message
		parsed, _ := json.Marshal(&response)
		w.Write(parsed)
		return
	}

	// syntax check
	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(common.ResCode_BadRequest, parseRequestErr.Error())
		return
	}
	payload, payloadErr := genPayload(request)
	if payloadErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(common.ResCode_BadRequest, payloadErr.Error())
		return
	}

	// whether the account exists
	nameExistence, nameExistenceErr := common.FindExistence("name", payload.Name)
	if nameExistenceErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(common.ResCode_Err, nameExistenceErr.Error())
		return
	}
	if nameExistence {
		respond(Code_NameTaken, "name already taken")
		return
	}
	emailExistence, emailExistenceErr := common.FindExistence("email", payload.Email)
	if emailExistenceErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(common.ResCode_Err, emailExistenceErr.Error())
		return
	}
	if emailExistence {
		respond(Code_EmailTaken, "email already taken")
		return
	}

	// try to save
	saveErr := savePayload(&payload)
	if saveErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(common.ResCode_Err, saveErr.Error())
		return
	}

	// try save here
	respond(common.ResCode_OK, "ok")
}

func savePayload(payload *Payload) error {
	mdb := global.MongoClient
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
	insertRes, insertErr := mdb.Database(config.DEFAULT_DATABASE).Collection("users").
		InsertOne(context.Background(), &user)
	if insertErr != nil {
		return insertErr
	}
	fmt.Printf("%v\n", insertRes)
	return nil
}

func genUserId(payload *Payload) uint32 {
	s := fmt.Sprintf("%v-%d", payload.Name, time.Now())
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}
