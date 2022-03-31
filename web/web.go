package web

import "embed"

//go:embed dist/assets/* index.html
var UIBox embed.FS
