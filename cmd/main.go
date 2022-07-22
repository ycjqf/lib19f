package main

import (
	"context"
	"fmt"
	"lib19f/api"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/global"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	// load enviroment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}

	// init all database connections
	global.InitConnections()
	if !global.AllConnectionsValid {
		panic(global.ConnectionsMessage)
	}
	fmt.Println("all connections initialized succesfully")

	// start api server
	const port = 1938
	addr := fmt.Sprintf(":%d", port)
	fmt.Printf("starting serer in port %v\n", port)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Mount("/", api.Route())

	getCommonHandler := func(status int, code string, message string) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			common.JsonRespond(w, status, &types.ApiBaseResponse{
				Code:    code,
				Message: message,
			})
		}
	}

	r.NotFound(getCommonHandler(http.StatusNotFound, "not found", "this page can not be reached"))
	r.MethodNotAllowed(getCommonHandler(http.StatusMethodNotAllowed, "method not allowed", "this method can not be used"))
	log.Fatal(http.ListenAndServe(addr, r))

	defer global.RedisClient.Close()
	defer global.MongoClient.Disconnect(context.Background())
}
