package accountRegister

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"hash/fnv"
	"lib19f-go/api/model"
	"lib19f-go/api/shared"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
		respond(shared.BaseCode_BadRequest, parseRequestErr.Error())
		return
	}
	payload, payloadErr := genPayload(request)
	if payloadErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		respond(shared.BaseCode_BadRequest, payloadErr.Error())
		return
	}

	// whether the account exists
	nameExistence, nameExistenceErr := findExistence("name", payload.Name)
	if nameExistenceErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(shared.BaseCode_Err, nameExistenceErr.Error())
		return
	}
	if nameExistence {
		respond(Code_NameTaken, "name already taken")
		return
	}
	emailExistence, emailExistenceErr := findExistence("email", payload.Email)
	if emailExistenceErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond(shared.BaseCode_Err, emailExistenceErr.Error())
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
		respond(shared.BaseCode_Err, saveErr.Error())
		return
	}

	// try save here
	respond(shared.BaseCode_OK, "ok")
}

func findExistence(key string, value string) (bool, error) {
	mdb := shared.Connections.Mdb
	existence := mdb.Database(shared.DEFAULT_DATABASE).Collection("users").
		FindOne(nil, bson.M{key: value})
	existenceErr := existence.Err()
	if existenceErr != nil && existenceErr != mongo.ErrNoDocuments {
		return false, errors.New("unable to find account existence")
	}
	if existenceErr != nil && existenceErr == mongo.ErrNoDocuments {
		return false, nil
	}
	return true, nil
}

func savePayload(payload *Payload) error {
	mdb := shared.Connections.Mdb
	user := model.User{
		Mid:          primitive.NewObjectID(),
		Id:           genUserId(payload),
		Name:         payload.Name,
		Email:        payload.Email,
		Password:     payload.Password,
		CreatedTime:  primitive.NewDateTimeFromTime(time.Now()),
		UpdatedTime:  primitive.NewDateTimeFromTime(time.Now()),
		Gender:       "unset",
		Avatar:       "",
		Introduction: "",
		VersionKey:   0,
	}
	insertRes, insertErr := mdb.Database(shared.DEFAULT_DATABASE).Collection("users").
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
