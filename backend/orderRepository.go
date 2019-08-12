package main

import (
	"github.com/jinzhu/gorm"
)

type OrderRepo struct {
	DB *gorm.DB
}

func NewOrderRepo(db *gorm.DB) OrderRepo {
	return OrderRepo{DB: db}
}

func (u *OrderRepo) Save(p Order) error {
	return u.DB.Save(&p).Error
}

func (u *OrderRepo) FindById(id string) (*Order, error) {
	prod := &Order{}
	return prod, u.DB.Where("id = ?", id).Find(prod).Error
}

func (u *OrderRepo) FindOrdersForOwner(limit, offset int64) ([]Order, int64, error) {
	prod := []Order{}
	err := u.DB.Find(&prod).Error

	return prod, 0, err
}

func (u *OrderRepo) FindOrdersForChef(limit, offset int64) ([]Order, int64, error) {
	prod := []Order{}
	err := u.DB.Where("order_status = ?", OrderStatusProcessing).Find(&prod).Error

	return prod, 0, err
}

func (u *OrderRepo) FindOrdersForUserWithId(id string, limit, offset int64) ([]Order, int64, error) {
	prod := []Order{}
	err := u.DB.Where("user_id = ?", id).Find(&prod).Error

	return prod, 0, err
}

func (u *OrderRepo) FindOrdersForUserWithIdAndStatusProcessing(id string, limit, offset int64) ([]Order, int64, error) {
	prod := []Order{}
	err := u.DB.Where("user_id = ? AND order_status = ?", id, OrderStatusProcessing).Find(&prod).Error

	return prod, 0, err
}
