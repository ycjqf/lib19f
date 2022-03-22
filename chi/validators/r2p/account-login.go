package r2p

import (
	"encoding/json"
	"errors"
	"io"
	"lib19f-go/api/types"
	"lib19f-go/config"
	"lib19f-go/utils"
	"net/mail"
)

func AccountLogin(body io.ReadCloser) (*types.AccountLoginPayload, error) {
	request := types.AccountLoginRequest{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return nil, errors.New("invalid form")
	}

	payload := types.AccountLoginPayload{}
	payload.Relog = request.Relog

	if !utils.Contains(config.VALID_CAPACITIES, request.Capacity) {
		return nil, errors.New("capacity invalid")
	}
	payload.Capacity = request.Capacity

	passwordMatch := config.PASSWORD_PATTERN.Match([]byte(request.Password))
	if passwordMatch == false {
		return nil, errors.New("password is not valid")
	}
	payload.Password = request.Password

	_, emailMatchErr := mail.ParseAddress(request.Email)
	emailValid := emailMatchErr == nil && len(request.Email) <= config.MAX_EMAIL_LEN
	if emailValid {
		payload.Using = "email"
		payload.Email = request.Email
	} else {
		nameValid := config.NAME_PATTERN.Match([]byte(request.Name))
		if nameValid {
			payload.Using = "name"
			payload.Name = request.Name
		} else {
			return nil, errors.New("name is not valid")
		}
	}

	return &payload, nil
}
