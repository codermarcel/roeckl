package main

import (
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"

	"github.com/gobuffalo/packr"
	"github.com/labstack/echo"
)

type i interface {
	GET(string, echo.HandlerFunc, ...echo.MiddlewareFunc) *echo.Route
}

const indexPage = "index.html"

func file(c echo.Context, f http.File) (err error) {
	var file string
	defer f.Close()

	fi, _ := f.Stat()
	if fi.IsDir() {
		file = filepath.Join(file, indexPage)
		f, err = os.Open(file)
		if err != nil {
			return echo.NotFoundHandler(c)
		}
		defer f.Close()
		if fi, err = f.Stat(); err != nil {
			return
		}
	}
	http.ServeContent(c.Response(), c.Request(), fi.Name(), fi.ModTime(), f)
	return
}

func static(box packr.Box, i i, prefix, root string) *echo.Route {
	if root == "" {
		root = "." // For security we want to restrict to CWD.
	}

	h := func(c echo.Context) error {
		p, err := url.PathUnescape(c.Param("*"))
		if err != nil {
			return err
		}
		name := filepath.Join(root, path.Clean("/"+p)) // "/"+ for security
		dat, err := box.Open(name)
		if err != nil {
			index, err := box.Open("index.html")
			if err != nil {
				return c.JSON(http.StatusOK, "error serving index page")
			}
			return file(c, index)
		}
		return file(c, dat)
	}

	i.GET(prefix, h)
	if prefix == "/" {
		return i.GET(prefix+"*", h)
	}

	return i.GET(prefix+"/*", h)
}
