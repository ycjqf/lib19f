package api

import (
	"lib19f-go/api/accountLogin"
	"lib19f-go/api/accountRegister"

	"github.com/go-chi/chi/v5"
)

func GetApi() *chi.Mux {
	r := chi.NewRouter()
	r.Mount("/account/register", accountRegister.GenApi())
	r.Mount("/account/login", accountLogin.GenApi())
	return r
}
