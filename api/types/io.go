package types

import "lib19f/model"

// Account Login

type AccountLoginRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Capacity string `json:"capacity"`
	Relog    bool   `json:"relog"`
}

type AccountLoginPayload struct {
	Using    string
	Capacity string
	Name     string
	Email    string
	Password string
	Relog    bool
}

type AccountLoginResponse struct {
	Code     string `json:"code"`
	Message  string `json:"message"`
	Id       uint32 `json:"id"`
	Capacity string `json:"capacity"`
}

// Account Register

type AccountRegisterRequest struct {
	Capacity       string
	Name           string `json:"name"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
}

type AccountRegisterPayload struct {
	Name     string
	Email    string
	Password string
	Capacity string
}

// Account Register Check

type AccountRegisterCheckNameRequestRequest struct {
	Name string `json:"name"`
}

type AccountRegisterCheckEmailRequestRequest struct {
	Email string `json:"email"`
}

type AccountRegisterCheckCommonRequestResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// Add Article

type AddArticleRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Body        string `json:"body"`
}

type AddArticlePayload = AddArticleRequest
type AddArticleResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Id      uint32 `json:"id"`
}

// Id Common

type IdCommonRequest struct {
	Id uint32 `json:"id"`
}

type IdCommonPayload = IdCommonRequest

// Get Articles

type GetArticelsResponse struct {
	Code     string                `json:"code"`
	Message  string                `json:"message"`
	Articles []model.ClientArticle `json:"articles"`
	Total    int64                 `json:"total"`
	PageSize int64                 `json:"pageSize"`
	Current  int64                 `json:"current"`
}

type GetArticlesRequest struct {
	Page     int64  `json:"page"`
	PageSize int64  `json:"pageSize"`
	Search   string `json:"search"`
	UserId   uint32 `json:"userId"`
	UserName string `json:"userName"`
	Since    int64  `json:"since"`
	Till     int64  `json:"till"`
	Status   string `json:"status"`
	Sort     string `json:"sort"`
}

type GetArticlesPayload = GetArticlesRequest

// Get Article
type GetArticleResponseWithArticle struct {
	Code    string              `json:"code"`
	Message string              `json:"message"`
	Article model.ClientArticle `json:"article"`
}

// Get User
type GetUserResponseWithUser struct {
	Code     string           `json:"code"`
	Message  string           `json:"message"`
	Capacity string           `json:"capacity"`
	User     model.ClientUser `json:"user"`
}

type UpdateArticleRequest struct {
	Id      uint32            `json:"id"`
	Article AddArticleRequest `json:"article"`
}

type UpdateReviewRequest struct {
	Id     uint32 `json:"id"`
	Status string `json:"status"`
}
type UpdateArticlePayload = UpdateArticleRequest
