package api

import (
	"context"
	"crypto/sha256"
	"fmt"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/global"
	"net/http"

	"github.com/go-redis/redis/v8"
)

var ApiAccountLogout = common.GenPostApi(apiAccountLogoutHandler)

func apiAccountLogoutHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}
	gotSessioCookie, gotSessioCookieErr := r.Cookie("account_session")
	if gotSessioCookieErr != nil {
		response.Code = types.ResCode_NotLoggedIn
		response.Message = "invalid cookie"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	fmt.Printf("received session id %v\n", gotSessioCookie.Value)

	rdb := global.RedisClient
	rs := rdb.Get(context.Background(), gotSessioCookie.Value)
	rsErr := rs.Err()
	if rsErr == redis.Nil {
		response.Code = types.ResCode_NotLoggedIn
		response.Message = "token not exist"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}
	if rsErr != nil {
		response.Code = types.ResCode_Err
		response.Message = "error when validate"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	rdb.Del(context.Background(), gotSessioCookie.Value)
	response.Code = types.ResCode_OK
	response.Message = "logged out"
	common.JsonRespond(w, http.StatusOK, &response)
}

func NewSHA256(data []byte) []byte {
	hash := sha256.Sum256(data)
	return hash[:]
}
