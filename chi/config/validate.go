package config

import (
	"fmt"
	"regexp"
)

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 20
const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 20
const MAX_EMAIL_LEN = 50

var VALID_CAPACITIES = []string{"admin", "user", "reviewer"}
var NAME_PATTERN = regexp.MustCompile(
	fmt.Sprintf(`^[a-zA-Z0-9_]{%d,%d}$`, NAME_MIN_LENGTH, NAME_MAX_LENGTH))
var PASSWORD_PATTERN = regexp.MustCompile(
	fmt.Sprintf(`^[a-zA-Z0-9_]{%d,%d}$`, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
