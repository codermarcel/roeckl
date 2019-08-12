package token

import (
	"github.com/o1egl/paseto"
	"golang.org/x/crypto/ed25519"
)

type Public struct {
	privateKey ed25519.PrivateKey
	publicKey  ed25519.PublicKey
	v2         paseto.Protocol
}

func NewPublic(privateKey ed25519.PrivateKey, publicKey ed25519.PublicKey) *Public {
	return &Public{privateKey: privateKey, publicKey: publicKey, v2: paseto.NewV2()}
}

func NewPublicFromBytes(privateKey []byte, publicKey []byte) *Public {
	return NewPublic(ed25519.PrivateKey(privateKey), ed25519.PublicKey(publicKey))
}

func (l *Public) Build(set ClaimSet) (string, error) {
	token, err := l.v2.Sign(l.privateKey, set.claims, set.GetFooter())

	return token, err
}

func (l *Public) Parse(token string) (ClaimSet, error) {
	var newToken paseto.JSONToken
	var footer string

	err := l.v2.Verify(token, l.publicKey, &newToken, &footer)

	claims := NewClaimSetFromJSONToken(newToken)
	claims.SetFooter(footer)

	return claims, err
}
