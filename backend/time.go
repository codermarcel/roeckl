package main

import "time"

// Now ...
func Now() int64 {
	return time.Now().Unix()
}
