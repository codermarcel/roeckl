package main

type Order struct {
	ID     string `json:"id"`      //uuid
	UserID string `json:"user_id"` //user that ordered the product

	CreatedAt   int64  `json:"created_at"` //unix time
	UpdatedAt   int64  `json:"updated_at"` //unix time
	OrderStatus string `json:"status"`     //order status
	TotalCost   int64  `json:"total_cost"` //the total cost of all products for this order in cents

	TableID           int64  `json:"table_id"`
	IsShipped         bool   `json:"is_shipped"`
	ShippingFirstName string `json:"shipping_first_name"`
	ShippingLastName  string `json:"shipping_last_name"`
	ShippingStreet    string `json:"shipping_street"`
	ShippingAddress   string `json:"shipping_address"`
	ShippingPhone     string `json:"shipping_phone"`
	ShippingInfo      string `json:"shipping_info"`
}

type orderStatus string

//roles
const (
	OrderStatusProcessing orderStatus = "processing"
	OrderStatusPaid       orderStatus = "paid"
	OrderStatusCanceled   orderStatus = "canceled"
)

func NewOrder(userid string, totalCost int64) Order {
	o := Order{
		IsShipped: false,
		TotalCost: totalCost,
		CreatedAt: Now(),
		UpdatedAt: Now(),
		UserID:    userid,
		ID:        UUID4(),
	}

	o.SetStatusProcessing()

	return o
}

func (p *Order) setOrderStatus(s orderStatus) {
	p.OrderStatus = string(s)
}

func (p *Order) SetStatusCanceled() {
	p.OrderStatus = string(OrderStatusCanceled)
}
func (p *Order) SetStatusProcessing() {
	p.OrderStatus = string(OrderStatusProcessing)
}

func (p *Order) SetStatusPaid() {
	p.OrderStatus = string(OrderStatusPaid)
}

func (o *Order) SetShipping(fn, ln, ad, st, ph, info string) {
	o.ShippingFirstName = fn
	o.ShippingLastName = ln
	o.ShippingAddress = ad
	o.ShippingStreet = st
	o.ShippingPhone = ph
	o.ShippingInfo = info
	o.IsShipped = true
}

func (o *Order) SetTable(tableid int64) {
	o.TableID = tableid
}
