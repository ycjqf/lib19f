package accountRegisterCheckName

import (
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/config"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func GenApi() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", handler)
	return r
}

func handler(w http.ResponseWriter, r *http.Request) {
	request := Request{}
	response := Response{}
	respond := func(status string) {
		response.Status = status
		parsed, _ := json.Marshal(&response)
		w.Write(parsed)
		return
	}
	if !config.NAME_PATTERN.Match([]byte(request.Name)) {
		respond("wrong")
		return
	}

	nameExistence, nameExistenceErr := common.FindExistence("name", request.Name)
	if nameExistenceErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond("error")
		return
	}
	if nameExistence {
		respond("taken")
		return
	}
	respond("valid")
}

type Request struct {
	Name string
}

type Response struct {
	Status string `json:"status"`
}
