package main

import "strings"

func WithinSet(set string, stringToCheck string) bool {
	for _, char := range stringToCheck {
		if !strings.Contains(set, string(char)) {
			return false
		}
	}

	return true
}

const alphaNumSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const germanSet = "ÄÖÜßäüöé"

func IsAlnum(stringToCheck string) bool {
	return WithinSet(alphaNumSet, stringToCheck)
}

func IsOneOf(toCheck string, pos ...string) (string, bool) {
	for _, i := range pos {
		if toCheck == i {
			return i, true
		}
	}

	return "", false
}

func IsOneOfIgnoreCase(toCheck string, pos ...string) (string, bool) {
	for _, i := range pos {
		if strings.ToLower(toCheck) == strings.ToLower(i) {
			return i, true
		}
	}

	return "", false
}
