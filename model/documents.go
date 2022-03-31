package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Mid          primitive.ObjectID `bson:"_id"`
	Id           uint32             `bson:"id"`
	Name         string             `bson:"name"`
	Email        string             `bson:"email"`
	Password     string             `bson:"password"`
	CreatedTime  primitive.DateTime `bson:"createdTime"`
	UpdatedTime  primitive.DateTime `bson:"updatedTime"`
	Avatar       string             `bson:"avatar"`
	Gender       string             `bson:"gender"`
	Introduction string             `bson:"introduction"`
	VersionKey   uint               `bson:"__v"`
}

type Admin = User
type Reviewer = User

type Article struct {
	Mid         primitive.ObjectID `bson:"_id"`
	Id          uint32             `bson:"id"`
	UserId      uint32             `bson:"userId"`
	Title       string             `bson:"title"`
	Description string             `bson:"decription"`
	Body        string             `bson:"body"`
	Poster      string             `bson:"poster"`
	Status      string             `bson:"status"`
	CreatedTime primitive.DateTime `bson:"createdTime"`
	UpdatedTime primitive.DateTime `bson:"updatedTime"`
	VersionKey  uint               `bson:"__v"`
}

type Comment struct {
	Mid         primitive.ObjectID `bson:"_id"`
	Id          uint32             `bson:"id"`
	UserId      uint32             `bson:"userId"`
	TargetType  string             `bson:"targetType"`
	TargetId    uint32             `bson:"targetId"`
	Body        string             `bson:"body"`
	CreatedTime primitive.DateTime `bson:"createdTime"`
	UpdatedTime primitive.DateTime `bson:"updatedTime"`
	VersionKey  uint               `bson:"__v"`
}
