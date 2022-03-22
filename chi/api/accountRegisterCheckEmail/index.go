package accountRegisterCheckEmail

import (
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/validators"
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
	if !validators.IsValidEmail(request.Email) == false {
		respond("wrong")
		return
	}

	emailExistence, emailExistenceErr := common.FindExistence("email", request.Email)
	if emailExistenceErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		respond("error")
		return
	}
	if emailExistence {
		respond("taken")
		return
	}
	respond("valid")
}

type Request struct {
	Email string
}

type Response struct {
	Status string `json:"status"`
}
