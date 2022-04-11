package r2p

import (
	"encoding/json"
	"errors"
	"io"
	"lib19f/api/types"
)

func IdCommon(body io.ReadCloser) (*types.IdCommonPayload, error) {
	request := types.IdCommonRequest{}
	payload := types.IdCommonPayload{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil || request.Id <= 0 {
		return &payload, errors.New("invalid id")
	}
	payload.Id = request.Id

	return &payload, nil
}
