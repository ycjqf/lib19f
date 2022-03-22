package main

import (
	"context"
	"encoding/json"
	"fmt"
	"lib19f-go/api"
	"lib19f-go/api/common"
	"lib19f-go/global"
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
	r.Mount("/v0/api", api.GetAllApis())

	getCommonHandler := func(code int) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(code)
			res, _ := json.Marshal(&common.ApiBaseResponse{
				Code:    common.ResCode_NotFound,
				Message: "not found",
			})
			w.Write(res)
		}
	}

	r.NotFound(getCommonHandler(http.StatusNotFound))
	r.MethodNotAllowed(getCommonHandler(http.StatusMethodNotAllowed))
	log.Fatal(http.ListenAndServe(":3000", r))

	defer global.RedisClient.Close()
	defer global.MongoClient.Disconnect(context.Background())
}
