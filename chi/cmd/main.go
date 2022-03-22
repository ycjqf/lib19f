package main

import (
	"context"
	"encoding/json"
	"fmt"
	"lib19f-go/api"
	"lib19f-go/api/shared"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	shared.InitConnections()
	if shared.Connections.Success == false {
		panic(shared.Connections.Message)
	}
	fmt.Println("all connections initialized succesfully")

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Mount("/v0/api", api.GetApi())
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(404)
		res, _ := json.Marshal(&shared.ApiBaseResponse{
			Code:    "404",
			Message: "not found",
		})
		w.Write(res)
	})
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(405)
		res, _ := json.Marshal(&shared.ApiBaseResponse{
			Code:    "405",
			Message: "not allowed",
		})
		w.Write(res)
	})

	log.Fatal(http.ListenAndServe(":3000", r))

	defer shared.Connections.Rdb.Close()
	defer shared.Connections.Mdb.Disconnect(context.Background())
}
