package api

import (
	"lib19f-go/api/accountLogin"
	"lib19f-go/api/accountLogout"
	"lib19f-go/api/accountRegister"
	"lib19f-go/api/accountRegisterCheckEmail"
	"lib19f-go/api/accountRegisterCheckName"

	"github.com/go-chi/chi/v5"
)

func GetAllApis() *chi.Mux {
	r := chi.NewRouter()
	r.Mount("/account/login", accountLogin.GenApi())
	r.Mount("/account/logout", accountLogout.GenApi())
	r.Mount("/account/register", accountRegister.GenApi())
	r.Mount("/account/register/check-email", accountRegisterCheckEmail.GenApi())
	r.Mount("/account/register/check-name", accountRegisterCheckName.GenApi())
	return r
}
