package main

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateProductRequest struct {
	Avatar  []byte `json:"avatar" form:"avatar" query:"avatar"` //avatar
	Details string `json:"details" form:"details" query:"details"`
}

type CreateProductDetails struct {
	Name        string `json:"name" form:"name" query:"name"`
	Price       int64  `json:"price" form:"price" query:"price"` //price in cents
	Description string `json:"description" form:"description" query:"description"`
	Quantity    int64  `json:"quantity" form:"quantity" query:"quantity"`
	Disabled    bool   `json:"disabled" form:"disabled" query:"disabled"`
	Category    string `json:"category" form:"category" query:"category"`
}

type DeleteProductRequest struct {
	ProductID string `json:"product_id" form:"product_id" query:"product_id"`
}

type UpdateProductRequest struct {
	Avatar  []byte `json:"avatar" form:"avatar" query:"avatar"` //avatar
	Details string `json:"details" form:"details" query:"details"`
}

type UpdateProductDetails struct {
	ID          string `json:"id" form:"id" query:"id"`
	Name        string `json:"name" form:"name" query:"name"`
	Price       int64  `json:"price" form:"price" query:"price"` //price in cents
	Description string `json:"description" form:"description" query:"description"`
	Quantity    int64  `json:"quantity" form:"quantity" query:"quantity"`
	Disabled    bool   `json:"disabled" form:"disabled" query:"disabled"`
	Category    string `json:"category" form:"category" query:"category"`
}

type PurchaseProductsRequest struct {
	ExpectedPrice int64                   `json:"expectedPrice"`
	Shipping      ShippingInfoRequest     `json:"shipping"`
	Products      []WantedProductsRequest `json:"products"`
}

type ShippingInfoRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Address   string `json:"address"`
	Street    string `json:"street"`
	Phone     string `json:"phone"`
	Info      string `json:"info"`
}
type WantedProductsRequest struct {
	ID       string `json:"product_id"`
	Quantity int64  `json:"wantedQuantity"`
}

type ListProductsRequest struct {
	Page     int64  `json:"page"`
	Category string `json:"category"`
}

type PaginationRequest struct {
	Page int64 `json:"page"`
}

type ListOrderRequest struct {
	OrderID string `json:"order_id" form:"order_id" query:"order_id"`
}

type GetUserDetailsRequest struct {
	UserID string `json:"user_id" form:"user_id" query:"user_id"`
}

type WaiterPurchaseProductsRequest struct {
	ExpectedPrice int64                         `json:"expectedPrice"`
	TableID       int64                         `json:"tableid"`
	Products      []WaiterWantedProductsRequest `json:"products"`
}

type WaiterWantedProductsRequest struct {
	ID       string `json:"product_id"`
	Quantity int64  `json:"wantedQuantity"`
	Note     string `json:"note"`
}

type CancelOrderRequest struct {
	OrderID string `json:"order_id" form:"order_id" query:"order_id"`
}

type MarkOrderPaidRequest struct {
	OrderID string `json:"order_id" form:"order_id" query:"order_id"`
}
