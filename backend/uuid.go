package main

import "github.com/google/uuid"

func UUID4() string {
	return uuid.New().String()
}
