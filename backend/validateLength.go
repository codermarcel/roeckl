package main

import (
	"fmt"
	"unicode/utf8"
)

func GetLength(str string) int {
	return utf8.RuneCountInString(str)
}

func MinLength(str string, min int) bool {
	return GetLength(str) >= min
}

func MaxLength(str string, max int) bool {
	return GetLength(str) <= max
}

func WithinLength(str string, min, max int) bool {
	return MinLength(str, min) && MaxLength(str, max)
}

func EnsureLength(input string, min, max int, name string) error {
	if !WithinLength(input, min, max) {
		return fmt.Errorf("%s needs to be at least %d characters and at most %d characters but has %d characters", name, min, max, GetLength(input))
	}

	return nil
}
