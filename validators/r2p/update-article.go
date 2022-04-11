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

func UpdateArticle(body io.ReadCloser) (*types.UpdateArticlePayload, error) {
	request := types.UpdateArticleRequest{}
	payload := types.UpdateArticlePayload{}
	parseRequestErr := json.NewDecoder(body).Decode(&request)
	if parseRequestErr != nil {
		return &payload, errors.New(config.MAL_JSON_ERORR_MESSAGE)
	}
	payload.Id = request.Id

	trimedTitle := strings.TrimSpace(request.Article.Title)
	println(trimedTitle)
	if len(trimedTitle) > config.MAX_TITLE_LENGTH ||
		len(trimedTitle) < config.MIN_TITLE_LENGTH {
		errMsg := fmt.Sprintf("title length should between %v and %v (inclusive)",
			config.MIN_TITLE_LENGTH, config.MAX_TITLE_LENGTH)
		return &payload, errors.New(errMsg)
	}
	payload.Article.Title = trimedTitle

	trimedDescription := strings.TrimSpace(request.Article.Description)
	if len(trimedDescription) > config.MAX_DESCRIPTION_LENGTH {
		errMsg := fmt.Sprintf("description length should be less than %v (inclusive)",
			config.MAX_DESCRIPTION_LENGTH)
		return &payload, errors.New(errMsg)
	}
	payload.Article.Description = trimedDescription

	trimedBody := strings.TrimSpace(request.Article.Body)
	if len(trimedBody) < config.MIN_ARTICLE_CHARS ||
		len(trimedBody) > config.MAX_ARTICLE_CHARS {
		errMsg := fmt.Sprintf("body length should between %v and %v (inclusive)",
			config.MIN_ARTICLE_CHARS, config.MAX_ARTICLE_CHARS)
		return &payload, errors.New(errMsg)
	}
	payload.Article.Body = trimedBody

	return &payload, nil
}
