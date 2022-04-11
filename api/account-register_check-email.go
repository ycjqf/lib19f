package api

import (
	"encoding/json"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/model"
	"lib19f/validators"
	"net/http"
)

var ApiAccountRegisterCheckEmail = common.GenPostApi(apiAccountRegisterCheckEmailHandler)

func apiAccountRegisterCheckEmailHandler(w http.ResponseWriter, r *http.Request) {
	request := types.AccountRegisterCheckEmailRequestRequest{}
	response := types.AccountRegisterCheckCommonRequestResponse{}

	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil {
		response.Status = "error"
		response.Message = "json format error"
		common.JsonRespond(w, http.StatusBadRequest, &response)
		return
	}

	if validators.IsValidEmail(request.Email) == false {
		response.Status = "wrong"
		response.Message = "not a valid email"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}

	emailExistence, emailExistenceErr := model.IsKVExist("user", "email", request.Email)
	if emailExistenceErr != nil {
		response.Status = "error"
		response.Message = emailExistenceErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if emailExistence {
		response.Status = "taken"
		response.Message = "this email is already taken by other user"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}
	response.Status = "valid"
	response.Message = "this email is available"
	common.JsonRespond(w, http.StatusOK, &response)
}
