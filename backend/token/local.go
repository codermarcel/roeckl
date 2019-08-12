package token

import (
	"github.com/o1egl/paseto"
)

type Local struct {
	secret []byte
	v2     paseto.Protocol
}

func NewLocal(secret []byte) *Local {
	b := &Local{secret: secret, v2: paseto.NewV2()}

	return b
}

func (l *Local) Build(set ClaimSet) (string, error) {
	token, err := l.v2.Encrypt(l.secret, set.claims, set.GetFooter())

	return token, err
}

func (l *Local) Parse(token string) (ClaimSet, error) {
	var newToken paseto.JSONToken
	var footer string

	err := l.v2.Decrypt(token, l.secret, &newToken, &footer)

	claims := NewClaimSetFromJSONToken(newToken)
	claims.SetFooter(footer)

	return claims, err
}
