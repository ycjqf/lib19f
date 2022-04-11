package r2p

import (
	"encoding/json"
	"errors"
	"io"
	"lib19f/api/types"
	"lib19f/config"
)

func GetArticles(body io.ReadCloser) (*types.GetArticlesPayload, error) {
	request := types.GetArticlesRequest{}
	payload := types.GetArticlesPayload{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return &payload, errors.New(config.MAL_JSON_ERORR_MESSAGE)
	}

	if request.Page < 0 {
		return &payload, errors.New("param 'page' is invalid, which should be an integer greater than 0, leave it empty to use default value as '1'")
	}
	if request.Page == 0 {
		payload.Page = 1
	} else {
		payload.Page = request.Page
	}

	if request.PageSize < 0 || request.PageSize > 100 {
		return &payload, errors.New("param 'pageSize' is invalid, which should be an integer greater than 0 and less than or equal to 100, leave it empty to use default value as '10'")
	}
	if request.PageSize == 0 {
		payload.PageSize = 10
	} else {
		payload.PageSize = request.PageSize
	}

	return &payload, nil
}
