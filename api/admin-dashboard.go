package api

import (
	"fmt"
	"lib19f/api/common"
	"lib19f/api/types"
	"net/http"
)

var ApiAdminDashboard = common.GenPostApi(apiAdminDashboardHandler)

func apiAdminDashboardHandler(w http.ResponseWriter, r *http.Request) {
	response := types.ApiBaseResponse{}

	sessionData, sessionDataSuccess := common.GetSessinDataOrRespond(w, r, true)
	if !sessionDataSuccess {
		return
	}

	if sessionData.Capacity != "admin" {
		response.Code = types.ResCode_Unauthorized
		response.Message = "you are not authorized to access this resource"
		common.JsonRespond(w, http.StatusUnauthorized, &response)
		return
	}

	fmt.Printf("sessionData: %+v\n", sessionData)
	common.JsonRespond(w, http.StatusUnauthorized, &response)

}
