package types

type ApiBaseResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

const (
	ResCode_OK              = "OK"
	ResCode_Err             = "INTERNAL_ERROR"
	ResCode_BadRequest      = "BAD_REQUEST"
	ResCode_NotFound        = "NOT_FOUND"
	ResCode_Unauthorized    = "UNAUTHORIZED"
	ResCode_WrongCredential = "WRONG_CREDENTIAL"
	ResCode_Logged          = "LOGGED"
	ResCode_NotLoggedIn     = "NOT_LOGGED_IN"
	ResCode_NameTaken       = "NAME_TAKEN"
	ResCode_EmailTaken      = "EMAIL_TAKEN"
	ResCode_NoSuchArticle   = "NO_SUCH_ARTICLE"
)
