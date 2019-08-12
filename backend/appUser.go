package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

func (a App) Profile(c echo.Context) error {
	userid, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	user, err := a.UserRepo.FindById(userid)
	if err != nil {
		return c.JSON(http.StatusOK, FailUserNotFound())
	}

	return c.JSON(http.StatusOK, Success("Success!", user))
}

func (a App) PurchaseProducts(c echo.Context) error {
	userid, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	u := &PurchaseProductsRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if len(u.Products) > 10 {
		return c.JSON(http.StatusOK, Fail("You can't purchase more than 10 products at a time"))
	}

	if len(u.Products) < 1 {
		return c.JSON(http.StatusOK, Fail("You need to purchase at least 1 product"))
	}

	s := u.Shipping

	//validation
	if err := ValidFirstName(s.FirstName); err != nil {
		return c.JSON(http.StatusOK, Fail(err.Error()))
	}
	if err := ValidLastName(s.LastName); err != nil {
		return c.JSON(http.StatusOK, Fail(err.Error()))
	}
	if err := ValidAddress(s.Address); err != nil {
		return c.JSON(http.StatusOK, Fail(err.Error()))
	}
	if err := ValidStreet(s.Street); err != nil {
		return c.JSON(http.StatusOK, Fail(err.Error()))
	}
	if err := ValidPhone(s.Phone); err != nil {
		return c.JSON(http.StatusOK, Fail(err.Error()))
	}
	if err := ValidInfo(s.Info); err != nil {
		return c.JSON(http.StatusOK, Fail(err.Error()))
	}
	//

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
	order.SetShipping(s.FirstName, s.LastName, s.Address, s.Street, s.Phone, s.Info)
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

		op := NewOrderProduct(order.ID, product.ID, userid, product.Name, x.Quantity, x.Quantity*product.Price, "")
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

func (a App) ListOrders(c echo.Context) error {
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
	orders, count, err := a.OrderRepo.FindOrdersForUserWithId(user.ID, limit, offset)
	hasMore := (count - offset) > int64(len(orders))

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]interface{}{"page": u.Page, "count": count, "hasMore": hasMore, "orders": orders}))
}

func (a App) ListOrder(c echo.Context) error {
	userid, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	orderProductsRepo := NewOrderProductsRepo(a.DB)

	u := &ListOrderRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	orders, err := orderProductsRepo.FindByOrderIdForUserId(u.OrderID, userid)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", orders))
}
