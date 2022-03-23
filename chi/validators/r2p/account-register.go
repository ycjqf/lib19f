package r2p

import (
	"encoding/json"
	"errors"
	"io"
	"lib19f-go/api/types"
	"lib19f-go/config"
	"lib19f-go/validators"
)

func AccountRegister(body io.ReadCloser) (*types.AccountRegisterPayload, error) {
	request := types.AccountRegisterRequest{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return nil, errors.New("invalid form")
	}
	payload := types.AccountRegisterPayload{}

	nameMatch := config.NAME_PATTERN.Match([]byte(request.Name))
	if nameMatch == false {
		return &payload, errors.New("invalid name")
	}
	payload.Name = request.Name

	if !validators.IsValidEmail(request.Email) {
		return &payload, errors.New("invalid email")
	}
	payload.Email = request.Email

	passwordMatch := config.PASSWORD_PATTERN.Match([]byte(request.Password))
	if passwordMatch == false {
		return &payload, errors.New("invalid password")
	}
	if request.Password != request.PasswordRepeat {
		return &payload, errors.New("password not match")
	}
	payload.Password = request.Password

	return &payload, nil
}
