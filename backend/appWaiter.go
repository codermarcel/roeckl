package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

func (a App) WaiterPurchase(c echo.Context) error {
	userid, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	u := &WaiterPurchaseProductsRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if len(u.Products) > 30 {
		return c.JSON(http.StatusOK, Fail("You can't purchase more than 10 products at a time"))
	}

	if len(u.Products) < 1 {
		return c.JSON(http.StatusOK, Fail("You need to purchase at least 1 product"))
	}

	for _, x := range u.Products {
		if x.Quantity < 1 {
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("can not purchase less than 1 of product with id %s", x.ID)))
		}

		if x.Quantity > 10 {
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("can not purchase more than 10 of product with id %s", x.ID)))
		}
	}

	ids := []string{}
	for _, v := range u.Products {
		ids = append(ids, v.ID)
	}

	tx := a.DB.Begin()

	if tx.Error != nil {
		a.debug(tx.Error.Error())
		return c.JSON(http.StatusOK, Fail("Could not order products"))
	}

	productRepo := NewProductRepo(tx)

	products, err := productRepo.FindProductsByIds(ids, 0, 10)
	if err != nil || len(products) < 1 {
		tx.Rollback()
		return c.JSON(http.StatusOK, Fail("Could not find products"))
	}

	m := map[string]Product{}
	for _, x := range products {
		m[x.ID] = x
	}

	totalCost := int64(0)

	for _, x := range u.Products {
		dbProduct, found := m[x.ID]

		if !found {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("product with id %s is not available for purchase", x.ID)))
		}

		if x.Quantity > dbProduct.Quantity {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("product with id %s is not available in that quantity", x.ID)))
		}

		totalCost += (dbProduct.Price * x.Quantity)
	}

	if totalCost != u.ExpectedPrice {
		tx.Rollback()
		return c.JSON(http.StatusOK, Fail(fmt.Sprintf("the total cost for this order is %d, the customer expected a cost of %d", totalCost, u.ExpectedPrice)))
	}

	order := NewOrder(userid, totalCost)
	order.SetTable(u.TableID)
	tx.Create(&order)

	if tx.Error != nil {
		tx.Rollback()
		return c.JSON(http.StatusOK, Fail("Could not create order"))
	}

	for _, x := range u.Products {
		product, found := m[x.ID]
		if !found {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("product with id %s is not available for purchase", x.ID)))
		}
		product.DecreaseQuantity(x.Quantity)
		tx.Save(&product)
		if tx.Error != nil {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("there was an error purchasing the product with id %s", x.ID)))
		}

		op := NewOrderProduct(order.ID, product.ID, userid, product.Name, x.Quantity, x.Quantity*product.Price, x.Note)
		tx.Create(&op)
		if tx.Error != nil {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail(fmt.Sprintf("there was an error purchasing the product with id %s", x.ID)))
		}
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return c.JSON(http.StatusOK, Fail("Could not place order"))
	}

	return c.JSON(http.StatusOK, Success("Success!", order))
}

func (a App) WaiterListOrder(c echo.Context) error {
	return a.ListOrder(c)
}

func (a App) WaiterListOrders(c echo.Context) error {
	userid, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	user, err := a.UserRepo.FindById(userid)
	if err != nil {
		return c.JSON(http.StatusOK, FailUserNotFound())
	}

	var limit int64 = 100

	u := &PaginationRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	offset := u.Page * limit
	orders, count, err := a.OrderRepo.FindOrdersForUserWithIdAndStatusProcessing(user.ID, limit, offset)
	hasMore := (count - offset) > int64(len(orders))

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]interface{}{"page": u.Page, "count": count, "hasMore": hasMore, "orders": orders}))
}

func (a App) WaiterCancelOrder(c echo.Context) error {
	orderRepo := NewOrderRepo(a.DB)

	u := &CancelOrderRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	order, err := orderRepo.FindById(u.OrderID)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find order"))
	}

	order.SetStatusCanceled()
	err = orderRepo.Save(*order)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not change order status"))
	}

	return c.JSON(http.StatusOK, Success("Success!", order))
}

func (a App) WaiterMarkOrderPaid(c echo.Context) error {
	orderRepo := NewOrderRepo(a.DB)

	u := &MarkOrderPaidRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	order, err := orderRepo.FindById(u.OrderID)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find order"))
	}

	//check userid here normally
	//if order.user_id != userid

	order.SetStatusPaid()
	err = orderRepo.Save(*order)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not change order status"))
	}

	return c.JSON(http.StatusOK, Success("Success!", order))
}
