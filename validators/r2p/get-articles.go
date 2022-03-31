package r2p

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"lib19f/api/types"
)

func GetArticles(body io.ReadCloser) (*types.GetArticlesPayload, error) {
	request := types.GetArticlesRequest{}
	payload := types.GetArticlesPayload{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return &payload, errors.New("invalid form")
	}

	if request.Page < 0 {
		return &payload, errors.New("invalid page")
	}
	if request.Page == 0 {
		payload.Page = 1
	} else {
		payload.Page = request.Page
	}

	if request.PageSize < 0 {
		return &payload, errors.New("invalid page size")
	}
	if request.PageSize > 100 {
		return &payload, errors.New("invalid page size")
	}
	if request.PageSize == 0 {
		payload.PageSize = 10
	} else {
		payload.PageSize = request.PageSize
	}

	fmt.Printf("%+v\n", payload)
	// payload.Id = request.Id

	return &payload, nil
}
