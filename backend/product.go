package main

type Product struct {
	ID          string `json:"id"` //uuid
	Name        string `json:"name"`
	Price       int64  `json:"price"` //price in cents!!
	Avatar      []byte `json:"-"`     //picture of the product
	Description string `json:"description"`
	Category    string `json:"category"`
	Quantity    int64  `json:"quantity"`
	CreatedAt   int64  `json:"created_at"` //unix time
	Disabled    bool   `json:"disabled"`
}

func NewProduct(name, description, category string, avatar []byte, price int64, disabled bool, quantity int64) Product {
	return Product{
		ID:          UUID4(),
		CreatedAt:   Now(),
		Name:        name,
		Description: description,
		Category:    category,
		Price:       price,
		Quantity:    quantity,
		Disabled:    disabled,
		Avatar:      avatar,
	}
}

func (p *Product) EditDetails(newName, newDesc string, newPrice, newQuantity int64, disabled bool, category string) {
	p.Disabled = disabled
	p.Name = newName
	p.Description = newDesc
	p.Quantity = newQuantity
	p.Price = newPrice
	p.Category = category
}

func (p *Product) SetAvatar(avatar []byte) {
	p.Avatar = avatar
}

func (p *Product) Enable() {
	p.Disabled = false
}

func (p *Product) Disable() {
	p.Disabled = true
}

func (p *Product) DecreaseQuantity(amount int64) {
	p.Quantity -= amount
}

func (p *Product) IncreaseQuantity(amount int64) {
	p.Quantity -= amount
}
