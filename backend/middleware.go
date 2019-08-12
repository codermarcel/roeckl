package main

import (
	"net/http"

	"github.com/labstack/echo"
)

// USERID_KEY is the key for the context value
const USERID_KEY = "context_userid"
const ROLE_CLAIM_KEY = "role"

func (a App) EnsureAuthenticated(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		val := c.Request().Header.Get("Authorization")
		claimSet, err := a.Tokenizer.Parse(val)

		if err != nil {
			return c.JSON(http.StatusOK, Fail("you are not authenticated"))
		}

		c.Set(USERID_KEY, claimSet.GetSubject())

		return next(c)
	}
}

func (a App) EnsureHasRole(claimValue string) func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			val := c.Request().Header.Get("Authorization")
			claimSet, err := a.Tokenizer.Parse(val)

			if err != nil {
				return c.JSON(http.StatusOK, Fail("you are not authenticated"))
			}

			if claimSet.Get(ROLE_CLAIM_KEY) != claimValue {
				return c.JSON(http.StatusOK, Fail("you are not authorized to do that"))
			}

			return next(c)
		}
	}
}
