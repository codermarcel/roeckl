package main

import (
	"errors"
	"fmt"
)

func ValidUsername(input string) error {
	if err := EnsureLength(input, 3, 25, "username"); err != nil {
		return err
	}

	charset := alphaNumSet + "-_."

	if !WithinSet(charset, input) {
		return fmt.Errorf("%s may only contain the following characters: %s", input, charset)
	}

	return nil
}

func ValidPassword(input string) error {
	if err := EnsureLength(input, 6, 99, "password"); err != nil {
		return err
	}

	return nil
}

func ValidEmail(input string) error {
	if err := EnsureLength(input, 6, 30, "email"); err != nil {
		return err
	}

	charset := alphaNumSet + "@-_+."

	if !WithinSet(charset, input) {
		return fmt.Errorf("%s may only contain the following characters: %s", input, charset)
	}

	return nil
}

func ValidUUID4(input string) error {
	if err := EnsureLength(input, 36, 36, "uuid"); err != nil {
		return errors.New("input is not a valid uuid4")
	}

	return nil
}
