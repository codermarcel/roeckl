package main

import (
	"github.com/jinzhu/gorm"
)

type OrderProductsRepo struct {
	DB *gorm.DB
}

func NewOrderProductsRepo(db *gorm.DB) OrderProductsRepo {
	return OrderProductsRepo{DB: db}
}

func (u *OrderProductsRepo) Save(p OrderProducts) error {
	return u.DB.Save(&p).Error
}

func (u *OrderProductsRepo) FindByOrderIdForUserId(id string, userid string) ([]OrderProducts, error) {
	prod := []OrderProducts{}
	err := u.DB.Where("order_id = ? AND user_id = ?", id, userid).Find(&prod).Error
	return prod, err
}
func (u *OrderProductsRepo) FindByOrderIdForOwner(id string) ([]OrderProducts, error) {
	prod := []OrderProducts{}
	err := u.DB.Where("order_id = ?", id).Find(&prod).Error
	return prod, err
}

func (u *OrderProductsRepo) FindByOrderIdForChef(id string) ([]OrderProducts, error) {
	prod := []OrderProducts{}
	err := u.DB.Where("order_id = ?", id).Find(&prod).Error
	return prod, err
}
