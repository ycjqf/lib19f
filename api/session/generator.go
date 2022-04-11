package session

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"lib19f/config"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func GenerateSessionId(capacity string, id uint32) string {
	hashed := sha256.New()
	plainEncrypted := fmt.Sprintf("%v-%v", config.SESSION_SECRET, uuid.New().String())
	hashed.Write([]byte(plainEncrypted))
	sessionId := hex.EncodeToString(hashed.Sum(nil))
	return fmt.Sprintf("%v%v", GenerateSessionIdPrefix(capacity, id), sessionId)
}

func GenerateSessionIdPrefix(capacity string, id uint32) string {
	return fmt.Sprintf("%v-%v-", capacity, id)
}

func ClearCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:    "account_session",
		MaxAge:  -1,
		Expires: time.Now(),
		Path:    "/",
	})
}
