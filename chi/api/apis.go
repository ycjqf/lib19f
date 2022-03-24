package api

import (
	"github.com/go-chi/chi/v5"
)

func GetAllApis() *chi.Mux {
	r := chi.NewRouter()
	r.Mount("/account/login", ApiAccountLogin)
	r.Mount("/account/logout", ApiAccountLogout)
	r.Mount("/account/register", ApiAccountRegister)
	r.Mount("/account/register/check-email", ApiAccountRegisterCheckEmail)
	r.Mount("/account/register/check-name", ApiAccountRegisterCheckName)
	r.Mount("/add/article", ApiAddArticle)
	r.Mount("/delete/article", ApiDeleteArticle)
	r.Mount("/get/article", ApiGetArticle)
	return r
}
