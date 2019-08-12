package main

type OrderProducts struct {
	ID          string `json:"id"`           //uuid
	OrderID     string `json:"order_id"`     //order id
	UserID      string `json:"user_id"`      //order id
	ProductID   string `json:"product_id"`   //product that was ordered
	ProductName string `json:"product_name"` //product name at the time of purchase
	Quantity    int64  `json:"quantity"`
	CentsPaid   int64  `json:"cents_paid"` //how much did the customer pay in cents in TOTAL (for all quantities, price * quantity)
	CreatedAt   int64  `json:"created_at"` //unix time
	Note        string `json:"note"`       //unix time
}

func NewOrderProduct(orderID, productid, userID string, productName string, quantity int64, pricePaid int64, note string) OrderProducts {
	o := OrderProducts{
		ID:          UUID4(),
		OrderID:     orderID,
		ProductID:   productid,
		UserID:      userID,
		ProductName: productName,
		Quantity:    quantity,
		CreatedAt:   Now(),
		CentsPaid:   pricePaid,
		Note:        note,
	}

	return o
}
