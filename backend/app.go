package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"roeckl/backend/token"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
)

type App struct {
	DB               *gorm.DB
	Tokenizer        token.Tokenizer
	Hasher           BcryptHasher
	UserRepo         UserRepo
	ProductRepo      ProductRepo
	OrderRepo        OrderRepo
	DebugEnabled     bool
	JwtExpireMinutes int64
}

func NewApp(debugEnabled bool, UserRepo UserRepo, ProductRepo ProductRepo, Hasher BcryptHasher, t token.Tokenizer, jwtExpire int64, orderRepo OrderRepo, db *gorm.DB) App {
	return App{DebugEnabled: debugEnabled, UserRepo: UserRepo, ProductRepo: ProductRepo, Hasher: Hasher, Tokenizer: t, JwtExpireMinutes: jwtExpire, OrderRepo: orderRepo, DB: db}
}

func (a App) debug(str string) {
	if a.DebugEnabled {
		log.Println(str)
	}
}

func (a App) ListCategories(c echo.Context) error {
	cat, err := a.ProductRepo.FindCategories()
	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find categories"))
	}

	return c.JSON(http.StatusOK, Success("Success!", cat))
}

func (a App) GetAvatar(c echo.Context) error {
	id := c.Param("id")
	p, err := a.ProductRepo.FindById(id)

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find this avatar"))
	}

	c.Response().Write(p.Avatar)
	return nil
}

func (a App) Login(c echo.Context) error {
	u := &LoginRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	found, err := a.UserRepo.FindByEmail(u.Email)
	if err != nil {
		return c.JSON(http.StatusOK, Fail("Bad Credentials"))
	}

	if !a.Hasher.Verify(found.PasswordHash, u.Password) {
		return c.JSON(http.StatusOK, Fail("Bad Credentials"))
	}

	found.PasswordHash = nil

	claimSet := token.NewClaimSet()
	claimSet.SetSubject(found.ID)
	claimSet.SetExpirationInMinutes(int(a.JwtExpireMinutes))
	claimSet.Set("role", found.Role)
	token, err := a.Tokenizer.Build(claimSet)

	if err != nil {
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("Could not generate jwt"))
	}

	return c.JSON(http.StatusOK, Success("Success! Welcome back", map[string]interface{}{"jwt": token, "user": found}))
}

func (a App) Register(c echo.Context) error {
	u := &RegisterRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidEmail(u.Email); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidUsername(u.Username); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	if err := ValidPassword(u.Password); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	hashedPw, err := a.Hasher.Hash(u.Password)

	if err != nil {
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("Something went wrong"))
	}

	user := NewUser(u.Username, u.Email, hashedPw)
	err = a.UserRepo.Save(user)

	if err != nil {
		a.debug(err.Error())
		return c.JSON(http.StatusOK, Fail("Could not register"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]string{"id": user.ID, "email": user.Email}))
}

func (a App) CreateProduct(c echo.Context) error {
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

func (a App) ListProducts(c echo.Context) error {
	var limit int64 = 100

	u := &ListProductsRequest{}
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusOK, BadRequest(err.Error()))
	}

	offset := u.Page * limit
	products, count, err := a.ProductRepo.FindEnabledProductsWithCategory(offset, limit, u.Category)
	hasMore := (count - offset) > int64(len(products))
	// maxPages := (count - offset) / limit

	if err != nil {
		return c.JSON(http.StatusOK, Fail("could not find products"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]interface{}{"page": u.Page, "count": count, "hasMore": hasMore, "products": products}))
}

func (a App) CancelOrder(c echo.Context) error {
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

func (a App) MarkOrderPaid(c echo.Context) error {
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
	fmt.Println("inside WaiterListOrders first")
	userid, ok := GetUserId(c)
	if !ok {
		fmt.Println("inside WaiterListOrders not ok", userid, ok)
		return c.JSON(http.StatusOK, FailNotAuthenticated())
	}

	fmt.Println("inside WaiterListOrders")
	user, err := a.UserRepo.FindById(userid)
	if err != nil {
		return c.JSON(http.StatusOK, FailUserNotFound())
	}

	fmt.Println("inside WaiterListOrders 2222")
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

func (a App) OwnerCancelOrder(c echo.Context) error {
	return a.CancelOrder(c)
}
func (a App) OwnerMarkOrderPaid(c echo.Context) error {
	return a.MarkOrderPaid(c)
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
