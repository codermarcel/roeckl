package main

import (
	"golang.org/x/crypto/bcrypt"
)

type BcryptHasher struct {
	Cost int
}

func NewBcryptHasher() BcryptHasher {
	return BcryptHasher{Cost: 11}
}

func (h BcryptHasher) Hash(pw string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(pw), h.Cost)
}

func (h BcryptHasher) Verify(passwordHash []byte, input string) bool {
	return bcrypt.CompareHashAndPassword(passwordHash, []byte(input)) == nil
}
