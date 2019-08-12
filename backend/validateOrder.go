package main

import (
	"fmt"
)

func ValidFirstName(input string) error {
	name := "first name"
	if err := EnsureLength(input, 3, 50, name); err != nil {
		return err
	}

	return nil
}
func ValidLastName(input string) error {
	name := "last name"
	if err := EnsureLength(input, 3, 50, name); err != nil {
		return err
	}

	return nil
}
func ValidStreet(input string) error {
	name := "street"
	if err := EnsureLength(input, 3, 50, name); err != nil {
		return err
	}

	return nil
}
func ValidAddress(input string) error {
	name := "address"
	if err := EnsureLength(input, 3, 50, name); err != nil {
		return err
	}

	return nil
}
func ValidPhone(input string) error {
	if GetLength(input) > 0 {
		name := "phone"
		if err := EnsureLength(input, 6, 30, name); err != nil {
			return err
		}

		charset := "+0123456789"
		if !WithinSet(charset, input) {
			return fmt.Errorf("%s may only contain the following characters: %s", name, charset)
		}
	}

	return nil
}

func ValidInfo(input string) error {
	if GetLength(input) > 0 {
		name := "Additional Info"
		if err := EnsureLength(input, 6, 99, name); err != nil {
			return err
		}

		// if !WithinSet(alphaNumSet, input) {
		// 	return fmt.Errorf("%s may only contain the following characters: %s", name, charset)
		// }
	}

	return nil
}
