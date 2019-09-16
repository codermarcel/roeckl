package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo"
)

func (a App) OwnerCreateProduct(c echo.Context) error {
	z := &CreateProductRequest{}
	if err := c.Bind(z); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	u := &CreateProductDetails{}
	err := json.Unmarshal([]byte(z.Details), u)

	if err != nil {
		return c.JSON(http.StatusOK, BadRequestGeneric())
	}

	if err := ValidProductName(u.Name); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductCategory(u.Category); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidPrice(u.Price); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductDescription(u.Description); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductQuantity(u.Quantity); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	avatar, err := c.FormFile("avatar")
	if err != nil {
		return c.JSON(http.StatusOK, BadRequestGeneric())
	}

	src, err := avatar.Open()
	if err != nil {
		return c.JSON(http.StatusOK, BadRequestGeneric())
	}
	defer src.Close()

	data, err := ioutil.ReadAll(src)

	if err != nil {
		return c.JSON(http.StatusOK, BadRequestGeneric())
	}

	prod := NewProduct(u.Name, u.Description, u.Category, data, u.Price, u.Disabled, u.Quantity)
	err = a.ProductRepo.Save(prod)

	if err != nil {
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("could not create product"))
	}

	return c.JSON(http.StatusOK, Success("Success!", prod))
}

func (a App) OwnerCancelOrder(c echo.Context) error {
	return a.WaiterCancelOrder(c)
}

func (a App) OwnerMarkOrderPaid(c echo.Context) error {
	return a.WaiterMarkOrderPaid(c)
}

func (a App) OwnerListOrder(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	orderProductsRepo := NewOrderProductsRepo(a.DB)

	u := &ListOrderRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	orders, err := orderProductsRepo.FindByOrderIdForOwner(u.OrderID)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", orders))
}

func (a App) OwnerGetUserDetails(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	u := &GetUserDetailsRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	user, err := a.UserRepo.FindById(u.UserID)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find user details"))
	}

	return c.JSON(http.StatusOK, Success("Success!", user))
}

func (a App) OwnerListOrders(c echo.Context) error {
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
	orders, count, err := a.OrderRepo.FindOrdersForOwner(limit, offset)
	hasMore := (count - offset) > int64(len(orders))

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find orders"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]interface{}{"page": u.Page, "count": count, "hasMore": hasMore, "orders": orders}))
}

func (a App) OwnerListProducts(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	var limit int64 = 100

	u := &ListProductsRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	offset := u.Page * limit
	products, count, err := a.ProductRepo.FindProductsForOwnerWithCategory(offset, limit, u.Category)
	hasMore := (count - offset) > int64(len(products))
	// maxPages := (count - offset) / limit

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find products"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]interface{}{"page": u.Page, "count": count, "hasMore": hasMore, "products": products}))

}

func (a App) OwnerListCategories(c echo.Context) error {
	return a.ListCategories(c)
}

func (a App) OwnerDeleteProduct(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	u := &DeleteProductRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	p, err := a.ProductRepo.FindById(u.ProductID)
	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find product to delete"))
	}

	err = a.ProductRepo.Delete(*p)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not delete product"))
	}

	return c.JSON(http.StatusOK, Success("Success!"))
}

func (a App) OwnerUpdateProduct(c echo.Context) error {
	_, ok := GetUserId(c)
	if !ok {
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	z := &UpdateProductRequest{}
	if err := c.Bind(z); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	u := &UpdateProductDetails{}
	err := json.Unmarshal([]byte(z.Details), u)

	if err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductName(u.Name); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidPrice(u.Price); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductDescription(u.Description); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductQuantity(u.Quantity); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidProductCategory(u.Category); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	tx := a.DB.Begin()
	txRepo := ProductRepo{DB: tx}

	prod, err := txRepo.FindById(u.ID)

	if err != nil {
		tx.Rollback()
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("could not find product with id "+u.ID))
	}

	prod.EditDetails(u.Name, u.Description, u.Price, u.Quantity, u.Disabled, u.Category)

	avatar, err := c.FormFile("avatar")
	if err == nil {
		src, err := avatar.Open()
		if err != nil {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail("Could not update the product avatar 2"))
		}
		defer src.Close()

		data, err := ioutil.ReadAll(src)

		if err != nil {
			tx.Rollback()
			return c.JSON(http.StatusOK, Fail("Could not update the product avatar 3"))
		}

		prod.SetAvatar(data)
	}

	err = txRepo.Save(*prod)

	if err != nil {
		tx.Rollback()
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("could not edit product"))
	}

	err = tx.Commit().Error

	if err != nil {
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("could not edit product, sorry"))
	}

	return c.JSON(http.StatusOK, Success("Success!", prod))
}
