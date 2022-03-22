package shared

import (
	"context"
	"embed"
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

var fs embed.FS

//go:embed mongo-url.txt
var mongoDbUrl string

//go:embed session-secret.txt
var sessionSecret string

func InitConnections() {

	if strings.TrimSpace(mongoDbUrl) == "" {
		Connections.Message = "no 'MONGODB_URI' environment variable found"
		return
	}

	mongoClient, connectMongoErr := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoDbUrl))
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
