package types

type AccountLoginRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Capacity string `json:"capacity"`
	Relog    bool   `json:"relog"`
}

type AccountLoginResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type AccountLoginPayload struct {
	Using    string
	Capacity string
	Name     string
	Email    string
	Password string
	Relog    bool
}
