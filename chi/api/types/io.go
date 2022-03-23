package types

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

// Account Register

type AccountRegisterRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
}

type AccountRegisterPayload struct {
	Name     string
	Email    string
	Password string
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
