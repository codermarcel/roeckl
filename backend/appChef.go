package main

import (
	"net/http"

	"github.com/labstack/echo"
)

func (a App) ChefListOrders(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	var limit int64 = 100

	u := &PaginationRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	offset := u.Page * limit
	orders, count, err := a.OrderRepo.FindOrdersForChef(limit, offset)
	hasMore := (count - offset) > int64(len(orders))

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]interface{}{"page": u.Page, "count": count, "hasMore": hasMore, "orders": orders}))
}

func (a App) ChefListOrder(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	orderProductsRepo := NewOrderProductsRepo(a.DB)

	u := &ListOrderRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	orders, err := orderProductsRepo.FindByOrderIdForChef(u.OrderID)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", orders))
}

func (a App) ChefCancelOrder(c echo.Context) error {
	return a.WaiterCancelOrder(c)
}
