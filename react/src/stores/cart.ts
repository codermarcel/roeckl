import { action, computed, observable } from "mobx";
import config from "./config";
import msgStore from "./message";
import { ProductInterface } from "./products";

export interface CartItemInterface extends ProductInterface {
    wantedQuantity: number
}

interface WantedInterface {
    wantedQuantity: number
    product_id: string
}

export class CartStore {
    @observable cartItems: Map<string, CartItemInterface> = new Map<string, CartItemInterface>()

    @computed get cartItemArray() {
        return Array.from(this.cartItems.values())
    }
    
    @action.bound checkOk(): boolean {
        if (this.uniqueProductsInCart > 10) {
            msgStore.setFail("You can not have more than 10 products in your cart")
            return false
        }
    
        if (this.productsInCart > 300) {
            msgStore.setFail("You can not have more than 300 product quantities in your cart")
            return false
        }

        return true
    }

    @action.bound setProduct(p: CartItemInterface) {
        this.cartItems.set(p.id, p)
    }

    //alias
    @action.bound addProduct(p: ProductInterface) {
        if (this.cartItems.get(p.id) !== undefined) {
            msgStore.setInfo("Product is already in cart")
            return true
        }

        this.cartItems.set(p.id, {...p, wantedQuantity: 1})
        msgStore.setLog("Product added to cart!")
        return true
    }

    @action.bound changeWantedQuantity(cartID: string, wantedQuantity: number) {
        wantedQuantity = Number(wantedQuantity)
        let cartItem = this.cartItems.get(cartID)
        if (cartItem !== undefined) {
            cartItem.wantedQuantity = wantedQuantity
            this.cartItems.set(cartItem.id, cartItem)
        }
    }

    @action.bound removeProduct(id: string) {
        return this.cartItems.delete(id)
    }

    @action.bound reset() {
        this.cartItems.clear()
    }

    @computed get totalCost() {
        let cost = 0
        this.cartItems.forEach((p: CartItemInterface) => {
            cost += (p.wantedQuantity * p.price)
        })
        return cost
    }

    //returns the total amount of products in cart 5 x peperoni pizza and 2 x fries == 10 products
    @computed get productsInCart() {
        let amount = 0
        this.cartItems.forEach((p: CartItemInterface) => {
            amount += p.wantedQuantity
        })
        return amount
    }

    //returns the total amount of unique products in cart 5 x peperoni pizza and 2 x fries == 2 unique products
    @computed get uniqueProductsInCart() {
        return this.cartItems.size
    }

    //returns the cart items as array to send to the server
    @computed get wantedProductsArray() {
        let ar: WantedInterface[] = []

        this.cartItemArray.forEach((value) => {
            ar.push({wantedQuantity: value.wantedQuantity, product_id: value.id})
        })

        return ar
    }
}


const store = new CartStore();

// for (let i = 1; i < 5; i++) {
//     let av = config.getTestProductAvatarPath(String(i))

//     store.setProduct({
//         id: String(i),
//         name: "iPhone " + i, 
//         avatar: av,
//         quantity: i * 2,
//         description: "Cool product: " + String(i),
//         category: "electronics",
//         price: i * 2,
//         wantedQuantity: 1,
//     })
// }


export default store