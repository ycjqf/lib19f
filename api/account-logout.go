package api

import (
	"context"
	"lib19f/api/common"
	"lib19f/api/session"
	"lib19f/api/types"
	"lib19f/global"
	"net/http"
)

var ApiAccountLogout = common.GenPostApi(apiAccountLogoutHandler)

func apiAccountLogoutHandler(w http.ResponseWriter, r *http.Request) {
	// check token existence in request
	response := types.ApiBaseResponse{}

	_, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, false)
	if !sessionDataSuccess {
		return
	}

	gotSessioCookie, _ := r.Cookie("account_session")
	delRes := global.RedisClient.Del(context.Background(), gotSessioCookie.Value)
	delErr := delRes.Err()
	if delErr != nil {
		response.Code = types.ResCodeErr
		response.Message = "unable to delete session, please try again later."
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	// clear when logout
	session.ClearCookie(w)
	response.Code = types.ResCodeOK
	response.Message = "you have been logged out."
	common.JsonRespond(w, http.StatusOK, &response)
}
