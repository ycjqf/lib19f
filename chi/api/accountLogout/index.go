package accountLogout

import (
	"encoding/json"
	"lib19f-go/api/shared"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func GenApi() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", handler)
	return r
}

func handler(w http.ResponseWriter, r *http.Request) {
	response := shared.ApiBaseResponse{}
	respond := func(code string, message string) {
		response.Code = code
		response.Message = message
		parsed, _ := json.Marshal(&response)
		w.Write(parsed)
		return
	}

	gotSessioCookie, gotSessioCookieErr := r.Cookie("account_session")
	if gotSessioCookieErr != nil {
		respond(shared.ResCode_NotLoggedIn, "invalid cookie")
		return
	}

	println(gotSessioCookie.Value)

	// try save here
	respond(shared.ResCode_OK, "ok")
}
