package api

import (
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/model"
	"lib19f-go/validators"
	"net/http"
)

var ApiAccountRegisterCheckEmail = common.GenPostApi(apiAccountRegisterCheckEmailHandler)

func apiAccountRegisterCheckEmailHandler(w http.ResponseWriter, r *http.Request) {
	request := types.AccountRegisterCheckEmailRequestRequest{}
	response := types.AccountRegisterCheckCommonRequestResponse{}

	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil {
		response.Status = "error"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	if validators.IsValidEmail(request.Email) == false {
		response.Status = "wrong"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}

	emailExistence, emailExistenceErr := model.IsKVExist("user", "email", request.Email)
	if emailExistenceErr != nil {
		response.Status = "error"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if emailExistence {
		response.Status = "taken"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}
	response.Status = "valid"
	common.JsonRespond(w, http.StatusOK, &response)
}
