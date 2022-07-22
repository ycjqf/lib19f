package r2p

import (
	"encoding/json"
	"errors"
	"io"
	"lib19f/api/types"
	"lib19f/config"
	"lib19f/validators"
)

func AccountRegister(body io.ReadCloser) (*types.AccountRegisterPayload, error) {
	request := types.AccountRegisterRequest{}
	payload := types.AccountRegisterPayload{}

	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return &payload, errors.New("invalid form")
	}

	// if !utils.Contains(config.VALID_CAPACITIES, request.Capacity) {
	// 	return &payload, errors.New("capacity invalid")
	// }
	// payload.Capacity = request.Capacity

	payload.Capacity = "user"

	nameMatch := config.NAME_PATTERN.Match([]byte(request.Name))
	if !nameMatch {
		return &payload, errors.New("invalid name")
	}
	payload.Name = request.Name

	if !validators.IsValidEmail(request.Email) {
		return &payload, errors.New("invalid email")
	}
	payload.Email = request.Email

	passwordMatch := config.PASSWORD_PATTERN.Match([]byte(request.Password))
	if !passwordMatch {
		return &payload, errors.New("invalid password")
	}
	if request.Password != request.PasswordRepeat {
		return &payload, errors.New("password not match")
	}
	payload.Password = request.Password

	return &payload, nil
}
