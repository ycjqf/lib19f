package config

import (
	_ "embed"
)

//go:embed SESSION_SECRET.txt
var SESSION_SECRET string
