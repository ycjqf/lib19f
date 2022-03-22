package shared

type ApiBaseResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

const (
	BaseCode_OK           = "OK"
	BaseCode_Err          = "INTERNAL_ERROR"
	BaseCode_BadRequest   = "BAD_REQUEST"
	BaseCode_NotFound     = "NOT_FOUND"
	BaseCode_Unauthorized = "UNAUTHORIZED"
)
