package types

import "time"

type SessionData struct {
	Capacity     string        `json:"capacity"`
	Id           uint32        `json:"id"`
	LoginTime    string        `json:"loginTime"`
	UpdatedTime  string        `json:"updatedTime"`
	Expiration   time.Duration `json:"expiration"`
	ReauthedTime uint32        `json:"reauthedTime"`
}
