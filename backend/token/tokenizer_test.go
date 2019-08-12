package token

import (
	"encoding/json"
	"testing"

	"golang.org/x/crypto/ed25519"

	"kit/crypto"

	"github.com/stretchr/testify/assert"
)

func TestAA(t *testing.T) {

	assert := assert.New(t)
	data := []string{"delete", "create", "update"}

	dat, err := json.Marshal(data)
	assert.Nil(err)

	m := string(dat)

	var dst []string
	err = json.Unmarshal([]byte(m), &dst)
	assert.Nil(err)

	assert.Equal(3, len(dst))
	assert.Equal("delete", dst[0])
}

func TestLocalBuilderImpl(t *testing.T) {
	key := crypto.NewEncryptionKey()
	builder := NewLocal(key.Raw())

	testTokenBuilder(t, builder)

}
func TestPublicBuilderImpl(t *testing.T) {
	assert := assert.New(t)
	pub, priv, err := ed25519.GenerateKey(nil)

	assert.Nil(err)

	builder := NewPublic(priv, pub)
	testTokenBuilder(t, builder)
}
func TestPublicBuilderImplWithoutPrivateKey(t *testing.T) {
	assert := assert.New(t)
	pub, priv, err := ed25519.GenerateKey(nil)

	assert.Nil(err)

	tk := NewPublic(priv, pub)

	subject := "user1"
	purpose := "purpose"
	randomClaim := "random"
	randomClaimKey := "random_key"

	claims := NewClaimSet()
	claims.SetSubject(subject)
	claims.SetPurpose(purpose)
	claims.Set(randomClaimKey, randomClaim)

	token, err := tk.Build(claims)

	newTk := NewPublic(nil, pub)

	assert.Nil(err)
	assert.NotEmpty(token)

	newClaims, err := newTk.Parse(token)

	assert.Nil(err)
	assert.NotNil(claims)

	assert.Equal(subject, newClaims.GetSubject())
	assert.Equal(purpose, newClaims.GetPurpose())
	assert.Equal(randomClaim, newClaims.Get(randomClaimKey))
}

func testTokenBuilder(t *testing.T, tk Builder) {
	assert := assert.New(t)

	subject := "user1"
	purpose := "purpose"
	randomClaim := "random"
	randomClaimKey := "random_key"

	claims := NewClaimSet()
	claims.SetSubject(subject)
	claims.SetPurpose(purpose)
	claims.Set(randomClaimKey, randomClaim)

	token, err := tk.Build(claims)

	assert.Nil(err)
	assert.NotEmpty(token)

	newClaims, err := tk.Parse(token)

	assert.Nil(err)
	assert.NotNil(claims)

	assert.Equal(subject, newClaims.GetSubject())
	assert.Equal(purpose, newClaims.GetPurpose())
	assert.Equal(randomClaim, newClaims.Get(randomClaimKey))
}
