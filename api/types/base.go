package types

type ApiBaseResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

const (
	ResCodeOK              = "OK"
	ResCodeErr             = "INTERNAL_ERROR"
	ResCodeBadRequest      = "BAD_REQUEST"
	ResCodeNotFound        = "NOT_FOUND"
	ResCodeUnauthorized    = "UNAUTHORIZED"
	ResCodeWrongCredential = "WRONG_CREDENTIAL"
	ResCodeLogged          = "LOGGED"
	ResCodeNotLoggedIn     = "NOT_LOGGED_IN"
	ResCodeNameTaken       = "NAME_TAKEN"
	ResCodeEmailTaken      = "EMAIL_TAKEN"
	ResCodeNoSuchArticle   = "NO_SUCH_ARTICLE"
)
