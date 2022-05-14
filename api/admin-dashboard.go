package api

import (
	"context"
	"fmt"
	"lib19f/api/common"
	"lib19f/global"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var ApiAdminDashboard = common.GenGetApi(apiAdminDashboardHandler)

func apiAdminDashboardHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		// messageType, p, err := conn.ReadMessage()
		// log.Printf("message type %v p %v\n", messageType, string(p))
		// if err != nil {
		// 	log.Printf("error %v\n", err.Error())
		// 	return
		// }

		// respErr := conn.WriteMessage(messageType, p)
		// if respErr != nil {
		// 	log.Println(err)
		// 	return
		// }
		count, countErr := global.MongoDatabase.Collection("articles").CountDocuments(context.Background(), bson.D{
			{Key: "status", Value: "pending"},
		})
		if countErr != nil {
			conn.WriteJSON(map[string]interface{}{
				"type":  "error",
				"error": countErr.Error(),
			})
		} else {
			conn.WriteJSON(map[string]interface{}{
				"type": "success",
				"data": fmt.Sprintf("%v", count),
			})
		}
		time.Sleep(time.Second * 10)
	}

	// sessionData, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, true)
	// if !sessionDataSuccess {
	// 	return
	// }

	// if sessionData.Capacity != "admin" {
	// 	response.Code = types.ResCodeUnauthorized
	// 	response.Message = "you are not authorized to access this resource"
	// 	common.JsonRespond(w, http.StatusUnauthorized, &response)
	// 	return
	// }
}
