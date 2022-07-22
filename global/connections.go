package global

import (
	"context"
	"lib19f/config"
	"os"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var AllConnectionsValid = false
var ConnectionsMessage = "pending"
var RedisClient *redis.Client = nil
var MongoClient *mongo.Client = nil
var MongoDatabase *mongo.Database = nil

func InitConnections() {
	// connect redis
	redisClient := redis.NewClient(&redis.Options{})
	_, redisPongErr := redisClient.Ping(context.Background()).Result()
	if redisPongErr != nil {
		ConnectionsMessage = "unable to connect to redis"
		return
	}
	RedisClient = redisClient

	// connect mongo
	mongoClientOpt := options.ClientOptions{
		Auth: &options.Credential{
			Username: os.Getenv("MONGO_INITDB_ROOT_USERNAME"),
			Password: os.Getenv("MONGO_INITDB_ROOT_PASSWORD"),
		},
	}
	mongoClientOpt.SetServerSelectionTimeout(config.SELECTION_TIMEOUT)
	mongoClient, connectMongoErr := mongo.Connect(context.Background(), &mongoClientOpt)
	if connectMongoErr != nil {
		ConnectionsMessage = "unable to init mongo connection"
		return
	}
	mongoPongErr := mongoClient.Ping(context.Background(), nil)
	if mongoPongErr != nil {
		ConnectionsMessage = "unable to connect to mongo"
		return
	}
	MongoClient = mongoClient
	MongoDatabase = MongoClient.Database(os.Getenv("DEFAULT_DB_NAME"))

	AllConnectionsValid = true
}
