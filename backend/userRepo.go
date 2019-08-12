package main

import "github.com/jinzhu/gorm"

type UserRepo struct {
	DB *gorm.DB
}

func NewUserRepo(db *gorm.DB) UserRepo {
	return UserRepo{DB: db}
}

func (u *UserRepo) FindByEmail(input string) (*User, error) {
	user := &User{}
	err := u.DB.Where("email = ?", input).First(&user).Error

	return user, err
}

func (u *UserRepo) FindById(input string) (*User, error) {
	user := &User{}
	err := u.DB.Where("id = ?", input).First(&user).Error

	return user, err
}

func (u *UserRepo) Save(user User) error {
	return u.DB.Save(&user).Error
}
