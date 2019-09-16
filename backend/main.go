package main

import (
	"fmt"
	"net/http"
	"os"
	"roeckl/backend/token"
	"strconv"
	"strings"

	"flag"

	"github.com/gobuffalo/packr"
	"github.com/joho/godotenv"
	"github.com/mholt/certmagic"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

const backendApiPrefix = "/api"

func main() {
	var debug bool
	var migrateUp bool
	var migrateDown bool
	var seed bool
	var fresh bool
	var port string
	var secret string
	var dbconnection string
	var dbdriver string
	var jwtexpireminutes string
	var tlsenabled bool
	domains := []string{"3m4u.tk", "www.3m4u.tk"}

	flag.BoolVar(&debug, "debug", true, "enable debug mode")
	flag.BoolVar(&migrateUp, "up", false, "run the up migrations")
	flag.BoolVar(&migrateDown, "down", false, "run the down migrations")
	flag.BoolVar(&seed, "seed", false, "seed the database")
	flag.BoolVar(&fresh, "fresh", false, "run the down migration, run the up migration and then seed the database")
	flag.StringVar(&port, "port", "1111", "the port that this app should listen on")
	flag.StringVar(&secret, "secret", "12345678901234567890123456789012", "the application secret, used for jwt validation")
	flag.StringVar(&dbconnection, "dbconnection", "test.db", "the connection string for the database driver")
	flag.StringVar(&dbdriver, "dbdriver", "sqlite3", "the database driver, for example sqlite3, mysql, postgres")
	flag.StringVar(&jwtexpireminutes, "jwtexpireminutes", "300", "in how many minutes should this jwt expire")
	flag.BoolVar(&tlsenabled, "tlsenabled", true, "enable https")
	flag.Parse()

	godotenv.Load(".env")
	godotenv.Overload(".env.local")

	value, found := os.LookupEnv("TLSENABLED")
	if found {
		if value == "true" {
			tlsenabled = true
		}
		if value == "false" {
			tlsenabled = false
		}
	}

	if fresh {
		migrateDown = true
		migrateUp = true
		seed = true
	}

	jwtExpire, err := strconv.Atoi(jwtexpireminutes)
	if err != nil || jwtExpire < 1 {
		jwtExpire = 300
	}

	jwtExpire64 := int64(jwtExpire)

	if len(secret) != 32 {
		panic("Secret needs to be 32 characters")
	}

	db, err := gorm.Open(dbdriver, dbconnection)
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	if debug {
		db.Debug()
	}

	tokenizer := token.NewLocal([]byte(secret))
	hasher := NewBcryptHasher()
	userRepo := NewUserRepo(db)
	productRepo := NewProductRepo(db)
	orderRepo := NewOrderRepo(db)

	app := NewApp(debug, userRepo, productRepo, hasher, tokenizer, jwtExpire64, orderRepo, db)

	Migrate(db, migrateUp, migrateDown)
	Seed(db, seed)

	ec := echo.New()
	box := packr.NewBox("../react/build")

	static(box, ec, "/", "")

	ec.HTTPErrorHandler = func(err error, c echo.Context) {
		if c.Request().URL == nil {
			c.JSON(http.StatusOK, Fail("something went wrong"))
			return
		}

		if !strings.HasPrefix(c.Request().URL.Path, backendApiPrefix) {
			b, err := box.Find("index.html")
			if err != nil {
				return
			}
			c.Blob(http.StatusOK, "text/html", b)
			return
		}

		c.JSON(http.StatusOK, Fail("endpoint not found"))
		return
	}

	ec.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
	}))

	ec.Debug = debug
	ec.HideBanner = true
	fmt.Println("-----Configuration-----")
	fmt.Printf("Fresh: %t\nDebug: %t\n Port: %s\nTLSEnabled: %t \n", fresh, debug, port, tlsenabled)
	fmt.Println("-----Configuration-----")

	e := ec.Group(backendApiPrefix)

	e.Any("/login", app.Login)
	e.Any("/register", app.Register)
	e.Any("/products", app.ListProducts)
	e.Any("/product/:id/avatar", app.GetAvatar)
	e.Any("/categories", app.ListCategories)

	users := e.Group("/user", app.EnsureAuthenticated)
	users.Any("/profile", app.Profile)
	users.Any("/purchase", app.PurchaseProducts)
	users.Any("/orders", app.ListOrders)
	users.Any("/order", app.ListOrder)

	waiter := e.Group("/waiter", app.EnsureAuthenticated, app.EnsureHasRole(string(WaiterRole)))
	waiter.Any("/purchase", app.WaiterPurchase)
	waiter.Any("/order/cancel", app.WaiterCancelOrder)
	waiter.Any("/order/paid", app.WaiterMarkOrderPaid)
	waiter.Any("/order", app.WaiterListOrder)
	waiter.Any("/orders", app.WaiterListOrders)

	owner := e.Group("/owner", app.EnsureAuthenticated, app.EnsureHasRole(string(OwnerRole)))
	owner.Any("/create-product", app.OwnerCreateProduct)
	owner.Any("/order/cancel", app.OwnerCancelOrder)
	owner.Any("/order/paid", app.OwnerMarkOrderPaid)
	owner.Any("/order", app.OwnerListOrder)
	owner.Any("/orders", app.OwnerListOrders)
	owner.Any("/products", app.OwnerListProducts)
	owner.Any("/categories", app.OwnerListCategories)
	owner.Any("/product/delete", app.OwnerDeleteProduct)
	owner.Any("/product/update", app.OwnerUpdateProduct)
	owner.Any("/user/details", app.OwnerGetUserDetails)

	chef := e.Group("/chef", app.EnsureAuthenticated, app.EnsureHasRole(string(ChefRole)))
	chef.Any("/order", app.ChefListOrder)
	chef.Any("/orders", app.ChefListOrders)
	chef.Any("/order/cancel", app.ChefCancelOrder)

	if tlsenabled {
		certmagic.Default.Agreed = true
		certmagic.Default.CA = certmagic.LetsEncryptProductionCA
		fmt.Println("serving https")
		ec.Logger.Fatal(certmagic.HTTPS(domains, ec))
	}

	ec.Logger.Fatal(ec.Start(":" + port))
}
