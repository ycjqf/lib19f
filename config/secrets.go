package config

import (
	"os"
)

var SESSION_SECRET string = os.Getenv("SESSION_SECRET")
