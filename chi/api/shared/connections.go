package shared

import (
	"context"
	"strings"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type InitializeResult struct {
	Success bool
	Message string
	Rdb     *redis.Client
	Mdb     *mongo.Client
}

var Connections InitializeResult = InitializeResult{
	Success: false,
	Message: "pending",
	Rdb:     nil,
	Mdb:     nil,
}

func InitConnections() {

	if strings.TrimSpace(MONGO_DB_URL) == "" {
		Connections.Message = "no 'MONGODB_URI' environment variable found"
		return
	}

	mongoClient, connectMongoErr := mongo.Connect(context.Background(), options.Client().ApplyURI(MONGO_DB_URL))
	if connectMongoErr != nil {
		Connections.Message = "unable to connect to mongo"
		return
	}
	Connections.Mdb = mongoClient

	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	_, pongErr := redisClient.Ping(context.Background()).Result()
	if pongErr != nil {
		mongoClient.Disconnect(context.Background())
		Connections.Message = "unable to connect to redis"
		return
	}

	Connections.Rdb = redisClient
	Connections.Success = true
}
