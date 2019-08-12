package main

import (
	"github.com/labstack/echo"
)

func GetUserId(c echo.Context) (string, bool) {
	s, err := c.Get(USERID_KEY).(string)
	return s, err
}
