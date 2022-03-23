package api

import (
	"lib19f-go/api/common"
	"lib19f-go/config"
	"net/http"
)

var ApiAddArticle = common.GenPostApi(apiAddArticleHandler)

func apiAddArticleHandler(w http.ResponseWriter, r *http.Request) {
	println(config.SESSION_SECRET)
}
