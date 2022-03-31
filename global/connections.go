package global

import (
	"context"
	"lib19f/config"
	"time"

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
	clientOpt := options.ClientOptions{}
	clientOpt.SetServerSelectionTimeout(time.Millisecond * 10).ApplyURI(config.MONGO_DB_URL)
	mongoClient, connectMongoErr := mongo.Connect(context.Background(), &clientOpt)
	if connectMongoErr != nil {
		ConnectionsMessage = "unable to initialize mongo connection"
		return
	}

	mongoPongErr := mongoClient.Ping(context.Background(), nil)
	if mongoPongErr != nil {
		ConnectionsMessage = "unable to connect to mongo"
		return
	}
	MongoClient = mongoClient
	MongoDatabase = MongoClient.Database(config.DEFAULT_DATABASE)

	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	_, pongErr := redisClient.Ping(context.Background()).Result()
	if pongErr != nil {
		mongoClient.Disconnect(context.Background())
		ConnectionsMessage = "unable to connect to redis"
		return
	}

	RedisClient = redisClient
	AllConnectionsValid = true
}
