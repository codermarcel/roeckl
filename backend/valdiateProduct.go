package main

import (
	"errors"
	"fmt"
)

func ValidProductCategory(input string) error {
	name := "product category"
	if err := EnsureLength(input, 3, 22, name); err != nil {
		return err
	}

	charset := alphaNumSet + germanSet + "-_. "

	if !WithinSet(charset, input) {
		return fmt.Errorf("%s may only contain the following characters: %s", name, charset)
	}

	return nil
}

func ValidProductName(input string) error {
	name := "product name"
	if err := EnsureLength(input, 3, 40, name); err != nil {
		return err
	}

	charset := alphaNumSet + germanSet + "-_. "

	if !WithinSet(charset, input) {
		return fmt.Errorf("%s may only contain the following characters: %s", name, charset)
	}

	return nil
}

func ValidPrice(input int64) error {
	if input < 1 {
		return errors.New("price has to be > 0")
	}

	return nil
}

func ValidProductDescription(input string) error {
	if err := EnsureLength(input, 6, 300, "product description"); err != nil {
		return err
	}

	charset := alphaNumSet + germanSet + "@-_+. s"

	if !WithinSet(charset, input) {
		return fmt.Errorf("%s may only contain the following characters: %s", input, charset)
	}

	return nil
}

func ValidProductQuantity(input int64) error {
	if input < 0 {
		return errors.New("quantity has to be > 0")
	}

	return nil
}
