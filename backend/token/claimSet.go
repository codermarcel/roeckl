package token

import (
	"encoding/json"
	"time"

	"github.com/o1egl/paseto"
)

type ClaimSet struct {
	footer string
	claims paseto.JSONToken
}

func NewClaimSet() ClaimSet {
	return ClaimSet{claims: paseto.JSONToken{Expiration: time.Now().Add(15 * time.Minute)}}
}

func NewClaimSetFromJSONToken(t paseto.JSONToken) ClaimSet {
	return ClaimSet{claims: t}
}

func (c *ClaimSet) Set(key, value string) {
	c.claims.Set(key, value)
}

func (c *ClaimSet) SetPurpose(value string) {
	c.Set("purpose", value)
}

func (c *ClaimSet) SetPermissions(values ...string) error {
	dat, err := json.Marshal(values)
	if err != nil {
		return err
	}

	c.Set("permissions", string(dat))
	return nil
}

func (c *ClaimSet) SetSubject(value string) {
	c.claims.Subject = value
}

func (c *ClaimSet) SetIssuer(value string) {
	c.claims.Issuer = value
}
func (c *ClaimSet) SetAudience(value string) {
	c.claims.Audience = value
}

func (c *ClaimSet) SetFooter(value string) {
	c.footer = value
}

func (c *ClaimSet) SetExpirationAt(t time.Time) {
	c.claims.Expiration = t
}

func (c *ClaimSet) SetExpirationInMinutes(value int) {
	c.claims.Expiration = time.Now().Add(time.Duration(value) * time.Minute)
}

func (c *ClaimSet) SetExpirationInHours(value int) {
	c.claims.Expiration = time.Now().Add(time.Duration(value) * time.Hour)
}

func (c *ClaimSet) SetNotBeforeAt(t time.Time) {
	c.claims.NotBefore = t
}

func (c *ClaimSet) SetNotBeforeInMinutes(value int) {
	c.claims.NotBefore = time.Now().Add(time.Duration(value) * time.Minute)
}

func (c *ClaimSet) SetNotBeforeInHours(value int) {
	c.claims.NotBefore = time.Now().Add(time.Duration(value) * time.Hour)
}

func (c *ClaimSet) Get(key string) string {
	return c.claims.Get(key)
}

func (c *ClaimSet) GetSubject() string {
	return c.claims.Subject
}

func (c *ClaimSet) GetIssuer() string {
	return c.claims.Issuer
}

func (c *ClaimSet) GetAudience() string {
	return c.claims.Audience
}

func (c *ClaimSet) GetFooter() string {
	return c.footer
}

func (c *ClaimSet) GetPurpose() string {
	return c.Get("purpose")
}

//test this
func (c *ClaimSet) GetPermissions() ([]string, error) {
	val := c.Get("permissions")
	var dst []string
	err := json.Unmarshal([]byte(val), &dst)

	if err != nil {
		return nil, err
	}

	return dst, nil
}

func (c *ClaimSet) GetClaims() paseto.JSONToken {
	return c.claims
}
