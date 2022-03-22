package accountRegister

import (
	"errors"
	"lib19f-go/api/shared"
	"net/mail"
)

type Request struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
}

type Response struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type Payload struct {
	Name     string
	Email    string
	Password string
}

const (
	Code_NameTaken  = "NAME_TAKEN"
	Code_EmailTaken = "EMAIL_TAKEN"
)

func genPayload(request Request) (Payload, error) {
	payload := Payload{}

	nameMatch := shared.NAME_PATTERN.Match([]byte(request.Name))
	if nameMatch == false {
		return payload, errors.New("invalid name")
	}
	payload.Name = request.Name

	_, emailMatchErr := mail.ParseAddress(request.Email)
	if emailMatchErr != nil || len(request.Email) > shared.MAX_EMAIL_LEN {
		return payload, errors.New("invalid email")
	}
	payload.Email = request.Email

	passwordMatch := shared.PASSWORD_PATTERN.Match([]byte(request.Password))
	if passwordMatch == false {
		return payload, errors.New("invalid password")
	}
	if request.Password != request.PasswordRepeat {
		return payload, errors.New("password not match")
	}
	payload.Password = request.Password

	return payload, nil
}
