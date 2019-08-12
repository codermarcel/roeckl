package main

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

func seedUsers(db *gorm.DB) {
	h := NewBcryptHasher()
	pw, _ := h.Hash("123456")

	// admin := NewUser("admin", "admin@admin.com", pw)
	// admin.ID = "16935690-348b-41a6-bb20-f8bb16011015"
	// admin.SetOwnerRole()
	// admin.Coins = 999

	tim := NewUser("tim customer", "tim@customer.com", pw)
	tim.SetCustomerRole()
	//alias
	tim1 := NewUser("tim user", "tim@user.com", pw)
	tim1.SetCustomerRole()

	tim2 := NewUser("tim waiter", "tim@waiter.com", pw)
	tim2.SetWaiterRole()
	//alias
	tim21 := NewUser("tim kellner", "tim@kellner.com", pw)
	tim21.SetWaiterRole()

	tim3 := NewUser("tim owner", "tim@owner.com", pw)
	tim3.SetOwnerRole()

	tim4 := NewUser("tim chef", "tim@chef.com", pw)
	tim4.SetChefRole()
	//alias
	tim41 := NewUser("tim cook", "tim@cook.com", pw)
	tim41.SetChefRole()

	db.Create(&tim)
	db.Create(&tim1)
	db.Create(&tim2)
	db.Create(&tim21)
	db.Create(&tim3)
	db.Create(&tim4)
	db.Create(&tim41)
}

func seedOrders(db *gorm.DB) {

}

func Seed(db *gorm.DB, seed bool) error {
	if !seed {
		return nil
	}

	tx := db.Begin()

	seedUsers(tx)
	seedProducts(tx)
	seedOrders(tx)

	return tx.Commit().Error
}

func Migrate(db *gorm.DB, up, down bool) error {
	db = db.Begin()
	if db.Error != nil {
		return db.Error
	}

	if down {
		if db.Exec(SQL_DOWN_NO_CASCADE).Error != nil {
			fmt.Println("error with down migration")
			return db.Rollback().Error
		}
	}

	if up {
		err := db.Exec(SQL_UP).Error
		if err != nil {
			fmt.Println("error with up migration", err.Error())
			return db.Rollback().Error
		}
	}

	return db.Commit().Error
}

const SQL_UP = `
CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash bytea NOT NULL,
	role VARCHAR(255) NOT NULL,
	created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
	id uuid PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	avatar VARCHAR(20000),
	price INTEGER NOT NULL,
	quantity INTEGER NOT NULL,
	category VARCHAR(255) NOT NULL,
	description VARCHAR(255) NOT NULL,
	created_at INTEGER NOT NULL,
	disabled boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
	id uuid PRIMARY KEY,
	user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
	order_status VARCHAR(255) NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	total_cost INTEGER NOT NULL,
	table_id INTEGER NOT NULL,
	is_shipped BOOLEAN NOT NULL,
	shipping_first_name VARCHAR(255),
	shipping_last_name VARCHAR(255),
	shipping_street VARCHAR(255),
	shipping_address VARCHAR(255),
	shipping_phone VARCHAR(255),
	shipping_info VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS order_products (
	id uuid PRIMARY KEY,
	order_id uuid NOT NULL REFERENCES orders ON DELETE CASCADE,
	product_id uuid NOT NULL REFERENCES products ON DELETE CASCADE,
	user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
	product_name VARCHAR(255) NOT NULL,
	quantity INTEGER NOT NULL,
	cents_paid INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	note VARCHAR(255) NOT NULL
);
`

func SQL_DOWN(cascade bool) string {
	if cascade {
		return SQL_DOWN_CASCADE
	}

	return SQL_DOWN_NO_CASCADE
}

const SQL_DOWN_CASCADE = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_products CASCADE;
`

const SQL_DOWN_NO_CASCADE = `
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_products;
`
