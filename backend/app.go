package main

import (
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

func (a App) Test(c echo.Context) error {
	return c.JSON(http.StatusOK, "test")
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
		return c.JSON(http.StatusOK, Fail("Could not register, Maybe the username or email has already been taken"))
	}

	return c.JSON(http.StatusOK, Success("Success!", map[string]string{"id": user.ID, "email": user.Email}))
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
