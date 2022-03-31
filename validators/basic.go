package validators

import (
	"lib19f/config"
	"net/mail"
)

func IsValidEmail(email string) bool {
	_, emailMatchErr := mail.ParseAddress(email)
	if emailMatchErr != nil || len(email) > config.MAX_EMAIL_LEN {
		return false
	}
	return true
}
