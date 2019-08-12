package main

type User struct {
	ID           string `json:"id"` //uuid
	Username     string `json:"username"`
	Email        string `json:"email"`
	PasswordHash []byte `json:"-"`
	Role         string `json:"role"`
	CreatedAt    int64  `json:"created_at"` //unix time
}

type role string

//roles
const (
	UserRole   role = "user"
	WaiterRole role = "waiter"
	OwnerRole  role = "owner"
	ChefRole   role = "chef"
)

func (u *User) setRole(r role) {
	u.Role = string(r)
}
func (u *User) SetCustomerRole() {
	u.setRole(UserRole)
}

func (u *User) SetWaiterRole() {
	u.setRole(WaiterRole)
}

func (u *User) SetOwnerRole() {
	u.setRole(OwnerRole)
}

func (u *User) SetChefRole() {
	u.setRole(ChefRole)
}

func NewUser(username, email string, passwordHash []byte) User {
	user := User{ID: UUID4(), Username: username, Email: email, PasswordHash: passwordHash, CreatedAt: Now()}
	user.SetCustomerRole()

	return user
}
