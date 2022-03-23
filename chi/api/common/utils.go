package common

import (
	"crypto/sha256"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
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

func GenSesionId(capacity string, id uint32) (string, string, string) {
	preffix := fmt.Sprintf("sess-%v-%v-", capacity, id)
	sessionId := fmt.Sprintf("sess-%v-%v-%x", capacity, id, time.Now())
	encrypted := fmt.Sprintf("%x", sha256.Sum256([]byte(sessionId)))
	return preffix, sessionId, encrypted
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
