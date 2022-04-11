package r2p

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"lib19f/api/types"
	"lib19f/config"
	"strings"
)

func AddArticle(body io.ReadCloser) (*types.AddArticlePayload, error) {
	request := types.AddArticleRequest{}
	payload := types.AddArticlePayload{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return &payload, errors.New(config.MAL_JSON_ERORR_MESSAGE)
	}

	trimedTitle := strings.TrimSpace(request.Title)
	if len(trimedTitle) > config.MAX_TITLE_LENGTH ||
		len(trimedTitle) < config.MIN_TITLE_LENGTH {
		errMsg := fmt.Sprintf("title length should between %v and %v (inclusive)",
			config.MIN_TITLE_LENGTH, config.MAX_TITLE_LENGTH)
		return &payload, errors.New(errMsg)
	}
	payload.Title = trimedTitle

	trimedDescription := strings.TrimSpace(request.Description)
	if len(trimedDescription) > config.MAX_DESCRIPTION_LENGTH {
		errMsg := fmt.Sprintf("description length should be less than %v (inclusive)",
			config.MAX_DESCRIPTION_LENGTH)
		return &payload, errors.New(errMsg)
	}
	payload.Description = trimedDescription

	trimedBody := strings.TrimSpace(request.Body)
	if len(trimedBody) < config.MIN_ARTICLE_CHARS ||
		len(trimedBody) > config.MAX_ARTICLE_CHARS {
		errMsg := fmt.Sprintf("body length should between %v and %v (inclusive)",
			config.MIN_ARTICLE_CHARS, config.MAX_ARTICLE_CHARS)
		return &payload, errors.New(errMsg)
	}
	payload.Body = trimedBody

	return &payload, nil
}
