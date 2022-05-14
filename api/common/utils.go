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

func GenGetApi(handler http.HandlerFunc) *chi.Mux {
	r := chi.NewRouter()
	r.Get("/", handler)
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
		response.Code = types.ResCodeUnauthorized
		response.Message = "no cookie found in request"
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	getSessionDataRes := global.RedisClient.Get(context.Background(), gotSessioCookie.Value)
	getSessionDataResErr := getSessionDataRes.Err()
	if getSessionDataResErr == redis.Nil {
		response.Code = types.ResCodeUnauthorized
		response.Message = "this token has expired"
		session.ClearCookie(w)
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	if getSessionDataResErr != nil {
		response.Code = types.ResCodeUnauthorized
		response.Message = "can not get session data"
		session.ClearCookie(w)
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	parseErr := json.Unmarshal([]byte(getSessionDataRes.Val()), &sessionData)
	if parseErr != nil {
		response.Code = types.ResCodeUnauthorized
		response.Message = "can not parse session data"
		JsonRespond(w, http.StatusUnauthorized, &response)
		return nil, false
	}

	if tryRefresh {
		sessionData.ReauthedTime = sessionData.ReauthedTime + 1
		sessionData.UpdatedTime = time.Now().String()
		js, _ := json.Marshal(sessionData)
		execRes := global.RedisClient.SetEX(context.Background(), gotSessioCookie.Value, js, time.Duration(config.LOGIN_EXPIRATION))
		if execRes.Err() != nil {
			response.Code = types.ResCodeUnauthorized
			response.Message = execRes.Err().Error()
			JsonRespond(w, http.StatusUnauthorized, &response)
			return nil, false
		}

		gotSessioCookie.Expires = time.Now().Add(config.LOGIN_EXPIRATION)
		gotSessioCookie.Path = "/"
		gotSessioCookie.Secure = true
		gotSessioCookie.HttpOnly = true
		http.SetCookie(w, gotSessioCookie)
	}

	return &sessionData, true
}
