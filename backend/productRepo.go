package main

import (
	"github.com/jinzhu/gorm"
)

type ProductRepo struct {
	DB *gorm.DB
}

func NewProductRepo(db *gorm.DB) ProductRepo {
	return ProductRepo{DB: db}
}

func (u *ProductRepo) Save(p Product) error {
	return u.DB.Save(&p).Error
}

func (u *ProductRepo) Delete(p Product) error {
	return u.DB.Delete(&p).Error
}

func (u *ProductRepo) FindById(id string) (*Product, error) {
	prod := &Product{}
	return prod, u.DB.Where("id = ?", id).Find(&prod).Error
}

func (u *ProductRepo) FindEnabledProductsWithCategory(offset int64, limit int64, category string) ([]Product, int64, error) {
	prod := []Product{}
	tx := u.DB.Begin()

	err := tx.Where("disabled = ? AND category = ? AND quantity > 0", false, category).Offset(offset).Limit(limit).Find(&prod).Error
	if err != nil {
		tx.Rollback()
		return []Product{}, 0, err
	}

	var count int64
	err = tx.Table("products").Where("disabled = ? AND category = ? AND quantity > 0", false, category).Count(&count).Error
	if err != nil {
		tx.Rollback()
		return []Product{}, 0, err
	}

	err = tx.Commit().Error

	return prod, count, err
}

type res struct {
	Category string `json:"category"`
}

func (u *ProductRepo) FindCategories() ([]res, error) {
	res := []res{}
	return res, u.DB.Raw("select DISTINCT category from products").Scan(&res).Error
}

func (u *ProductRepo) FindProductsByIds(ids []string, offset int64, limit int64) ([]Product, error) {
	prod := []Product{}
	tx := u.DB

	err := tx.Where("disabled = ? AND id in (?)", false, ids).Offset(offset).Limit(limit).Find(&prod).Error
	if err != nil {
		return []Product{}, err
	}

	return prod, err
}

func (u *ProductRepo) FindProductsForOwnerWithCategory(offset int64, limit int64, category string) ([]Product, int64, error) {
	prod := []Product{}
	tx := u.DB

	err := tx.Where("category = ?", category).Offset(offset).Limit(limit).Find(&prod).Error
	if err != nil {
		return []Product{}, 0, err
	}

	return prod, 0, err
}
