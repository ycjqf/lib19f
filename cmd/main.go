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
)

func main() {
	global.InitConnections()
	if global.AllConnectionsValid == false {
		panic(global.ConnectionsMessage)
	}
	fmt.Println("all connections initialized succesfully")

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	// r.Use(middleware.ContentCharset("utf-8"))
	r.Mount("/", api.Route())

	getCommonHandler := func(code int) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			common.JsonRespond(w, code, &types.ApiBaseResponse{
				Code:    types.ResCode_NotFound,
				Message: "not found",
			})
		}
	}

	r.NotFound(getCommonHandler(http.StatusNotFound))
	r.MethodNotAllowed(getCommonHandler(http.StatusMethodNotAllowed))
	log.Fatal(http.ListenAndServe(":1938", r))

	defer global.RedisClient.Close()
	defer global.MongoClient.Disconnect(context.Background())
}
