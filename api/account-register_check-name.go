package api

import (
	"encoding/json"
	"lib19f/api/common"
	"lib19f/api/types"
	"lib19f/config"
	"lib19f/model"
	"net/http"
)

var ApiAccountRegisterCheckName = common.GenPostApi(apiAccountRegisterCheckNameHandler)

func apiAccountRegisterCheckNameHandler(w http.ResponseWriter, r *http.Request) {
	request := types.AccountRegisterCheckNameRequestRequest{}
	response := types.AccountRegisterCheckCommonRequestResponse{}

	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil {
		response.Status = "error"
		response.Message = "json format error"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	if !config.NAME_PATTERN.Match([]byte(request.Name)) {
		response.Status = "wrong"
		response.Message = "not a valid name"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}

	nameExistence, nameExistenceErr := model.IsKVExist("user", "name", request.Name)
	if nameExistenceErr != nil {
		response.Status = "error"
		response.Message = nameExistenceErr.Error()
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if nameExistence {
		response.Status = "taken"
		response.Message = "this name is already taken by other user"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}
	response.Status = "valid"
	response.Message = "this name is available"
	common.JsonRespond(w, http.StatusOK, &response)
}
