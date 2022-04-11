package common

import (
	"context"
	"encoding/json"
	"fmt"
	"lib19f/api/session"
	"lib19f/api/types"
	"lib19f/config"
	"lib19f/global"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-redis/redis/v8"
	"github.com/unrolled/render"
	"golang.org/x/crypto/bcrypt"
)

func EncryptPassword(password string) (string, error) {
	passwordBytes := []byte(password)
	hashedPasswordBytes, err := bcrypt.
		GenerateFromPassword(passwordBytes, bcrypt.MinCost)
	return string(hashedPasswordBytes), err
}

func DoPasswordsMatch(hashedPassword, currPassword string) bool {
	err := bcrypt.CompareHashAndPassword(
		[]byte(hashedPassword), []byte(currPassword))
	return err == nil
}

func GenPostApi(handler http.HandlerFunc) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", handler)
	return r
}

func JsonRespond(w http.ResponseWriter, status int, data interface{}) {
	rtr := render.JSON{
		Head: render.Head{
			Status:      status,
			ContentType: fmt.Sprintf("%s; charset=utf-8", render.ContentJSON),
		},
	}
	repondErr := rtr.Render(w, &data)
	if repondErr != nil {
		panic(repondErr.Error())
	}
	return
}

func GetSessinDataOrRespond(w http.ResponseWriter, r *http.Request, tryRefresh bool) (*types.SessionData, bool) {
	response := types.ApiBaseResponse{}
	sessionData := types.SessionData{}

	gotSessioCookie, gotSessioCookieErr := r.Cookie("account_session")
	if gotSessioCookieErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "no cookie found in request"
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	getSessionDataRes := global.RedisClient.Get(context.Background(), gotSessioCookie.Value)
	getSessionDataResErr := getSessionDataRes.Err()
	if getSessionDataResErr == redis.Nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "this token has expired"
		session.ClearCookie(w)
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	if getSessionDataResErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "can not get session data"
		session.ClearCookie(w)
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	parseErr := json.Unmarshal([]byte(getSessionDataRes.Val()), &sessionData)
	if parseErr != nil {
		response.Code = types.ResCode_Unauthorized
		response.Message = "can not parse session data"
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	if tryRefresh {
		println("try to refresh session", gotSessioCookie.Value)
		execRes := global.RedisClient.Expire(context.Background(), gotSessioCookie.Value, time.Duration(config.LOGIN_EXPIRATION))
		if execRes.Err() != nil {
			response.Code = types.ResCode_Unauthorized
			response.Message = execRes.Err().Error()
			JsonRespond(w, http.StatusUnauthorized, &response)
			return nil, false
		}

		gotSessioCookie.Expires = time.Now().Add(time.Duration(config.LOGIN_EXPIRATION))
		http.SetCookie(w, gotSessioCookie)
	}

	return &sessionData, true
}