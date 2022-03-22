package api

import (
	"lib19f-go/api/accountLogin"
	"lib19f-go/api/accountLogout"
	"lib19f-go/api/accountRegister"

	"github.com/go-chi/chi/v5"
)

func GetApi() *chi.Mux {
	r := chi.NewRouter()
	r.Mount("/account/login", accountLogin.GenApi())
	r.Mount("/account/logout", accountLogout.GenApi())
	r.Mount("/account/register", accountRegister.GenApi())
	return r
}
