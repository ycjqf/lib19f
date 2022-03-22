package common

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"hash/fnv"
	"lib19f-go/config"
	"lib19f-go/global"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func EncryptPassword(password string) (string, error) {
	passwordBytes := []byte(password)
	hashedPasswordBytes, err := bcrypt.
		GenerateFromPassword(passwordBytes, bcrypt.MinCost)
	return string(hashedPasswordBytes), err
}

func DoPasswordsMatch(hashedPassword, currPassword string) bool {
	err := bcrypt.CompareHashAndPassword(
		[]byte(hashedPassword), []byte(currPassword))
	return err == nil
}

func FindExistence(key string, value string) (bool, error) {
	mdb := global.MongoClient
	existence := mdb.Database(config.DEFAULT_DATABASE).Collection("users").
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

func GenSesionId(capacity string, id uint32) (string, string) {
	sessionId := fmt.Sprintf("sess-%v-%v-%x", capacity, id,
		fnv.New32a().Sum([]byte(time.Now().String())))
	encrypted := fmt.Sprintf("%x", sha256.Sum256([]byte(sessionId)))
	return sessionId, encrypted
}
