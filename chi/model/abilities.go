package model

import (
	"context"
	"errors"
	"fmt"
	"lib19f-go/config"
	"lib19f-go/global"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func IsKVExist(capacity string, key string, value string) (bool, error) {
	mdb := global.MongoClient
	existence := mdb.Database(config.DEFAULT_DATABASE).Collection(fmt.Sprintf("%vs", capacity)).
		FindOne(context.Background(), bson.M{key: value})
	existenceErr := existence.Err()
	if existenceErr != nil && existenceErr != mongo.ErrNoDocuments {
		return false, errors.New("unable to find account existence")
	}
	if existenceErr != nil && existenceErr == mongo.ErrNoDocuments {
		return false, nil
	}
	return true, nil
}
