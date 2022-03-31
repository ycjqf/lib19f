package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type ClientArticle struct {
	Id          uint32             `json:"id"`
	Title       string             `json:"title"`
	Description string             `json:"decription"`
	Body        string             `json:"body"`
	Poster      string             `json:"poster"`
	Status      string             `json:"status"`
	CreatedTime primitive.DateTime `json:"createdTime"`
	UpdatedTime primitive.DateTime `json:"updatedTime"`
	User        ClientUser         `json:"user"`
}

type ClientUser struct {
	Id           uint32             `json:"id"`
	Name         string             `json:"name"`
	Email        string             `json:"email"`
	CreatedTime  primitive.DateTime `json:"createdTime"`
	UpdatedTime  primitive.DateTime `json:"updatedTime"`
	Avatar       string             `json:"avatar"`
	Gender       string             `json:"gender"`
	Introduction string             `json:"introduction"`
}
