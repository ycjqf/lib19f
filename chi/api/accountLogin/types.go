package accountLogin

import (
	"errors"
	"lib19f-go/api/shared"
	"net/mail"
)

type Request struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Capacity string `json:"capacity"`
	Relog    bool   `json:"relog"`
}

type Response struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type Payload struct {
	Using    string
	Capacity string
	Name     string
	Email    string
	Password string
	Relog    bool
}

func genPayload(request Request) (Payload, error) {
	payload := Payload{}
	payload.Relog = request.Relog

	if !shared.Contains(shared.VALID_CAPACITIES, request.Capacity) {
		return payload, errors.New("capacity invalid")
	}
	payload.Capacity = request.Capacity

	passwordMatch := shared.PASSWORD_PATTERN.Match([]byte(request.Password))
	if passwordMatch == false {
		return payload, errors.New("password is not valid")
	}
	payload.Password = request.Password

	_, emailMatchErr := mail.ParseAddress(request.Email)
	emailValid := emailMatchErr == nil && len(request.Email) <= shared.MAX_EMAIL_LEN
	if emailValid {
		payload.Using = "email"
		payload.Email = request.Email
	} else {
		nameValid := shared.NAME_PATTERN.Match([]byte(request.Name))
		if nameValid {
			payload.Using = "name"
			payload.Name = request.Name
		} else {
			return payload, errors.New("name is not valid")
		}
	}

	return payload, nil
}
