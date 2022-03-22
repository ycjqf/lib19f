package shared

import (
	"crypto/sha256"
	"fmt"
	"hash/fnv"
	"time"

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

func GenSesionId(capacity string, id uint32) (string, string) {
	sessionId := fmt.Sprintf("sess-%v-%v-%x", capacity, id,
		fnv.New32a().Sum([]byte(time.Now().String())))
	encrypted := fmt.Sprintf("%x", sha256.Sum256([]byte(sessionId)))
	return sessionId, encrypted
}

func Contains[T comparable](s []T, e T) bool {
	for _, v := range s {
		if v == e {
			return true
		}
	}
	return false
}
