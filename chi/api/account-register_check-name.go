package api

import (
	"encoding/json"
	"lib19f-go/api/common"
	"lib19f-go/api/types"
	"lib19f-go/config"
	"lib19f-go/model"
	"net/http"
)

var ApiAccountRegisterCheckName = common.GenPostApi(apiAccountRegisterCheckNameHandler)

func apiAccountRegisterCheckNameHandler(w http.ResponseWriter, r *http.Request) {
	request := types.AccountRegisterCheckNameRequestRequest{}
	response := types.AccountRegisterCheckCommonRequestResponse{}

	parseRequestErr := json.NewDecoder(r.Body).Decode(&request)
	if parseRequestErr != nil {
		response.Status = "error"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}

	if !config.NAME_PATTERN.Match([]byte(request.Name)) {
		response.Status = "wrong"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}

	nameExistence, nameExistenceErr := model.IsKVExist("user", "name", request.Name)

	if nameExistenceErr != nil {
		response.Status = "error"
		common.JsonRespond(w, http.StatusInternalServerError, &response)
		return
	}
	if nameExistence {
		response.Status = "taken"
		common.JsonRespond(w, http.StatusOK, &response)
		return
	}
	response.Status = "valid"
	common.JsonRespond(w, http.StatusOK, &response)
}
