package accountLogout

import (
	"encoding/json"
	"lib19f-go/api/common"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func GenApi() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", handler)
	return r
}

func handler(w http.ResponseWriter, r *http.Request) {
	response := common.ApiBaseResponse{}
	respond := func(code string, message string) {
		response.Code = code
		response.Message = message
		parsed, _ := json.Marshal(&response)
		w.Write(parsed)
		return
	}

	gotSessioCookie, gotSessioCookieErr := r.Cookie("account_session")
	if gotSessioCookieErr != nil {
		respond(common.ResCode_NotLoggedIn, "invalid cookie")
		return
	}

	println(gotSessioCookie.Value)

	// try save here
	respond(common.ResCode_OK, "ok")
}
