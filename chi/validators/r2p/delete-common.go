package r2p

import (
	"encoding/json"
	"errors"
	"io"
	"lib19f-go/api/types"
)

func DeleteCommon(body io.ReadCloser) (*types.DeleteCommonPayload, error) {
	request := types.DeleteCommonRequest{}
	payload := types.DeleteCommonPayload{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil || request.Id == 0 {
		return &payload, errors.New("invalid form")
	}
	payload.Id = request.Id

	return &payload, nil
}
