import { action, computed, observable } from "mobx";
import { ProductInterface } from "./products";

export interface CartItemInterface extends ProductInterface {
    wantedQuantity: number
    note: string
}

interface WantedInterface {
    wantedQuantity: number
    product_id: string
    note: string
}

export class CartStore {
    @observable tableid: number = 0;
    @observable cartItems: Map<string, CartItemInterface> = new Map<string, CartItemInterface>()

    constructor(tableid: number) {
        this.tableid = tableid
    }

    @computed get cartItemArray() {
        return Array.from(this.cartItems.values())
    }

    getWanted(id) {
        let item = this.cartItems.get(id)
        if (item === undefined) {
            return 0
        }

        return item.wantedQuantity
    }

    getNote(id) {
        let item = this.cartItems.get(id)
        if (item === undefined) {
            return ""
        }

        return item.note
    }

    @action.bound setNote(product: ProductInterface, newNote: string) {
        newNote = String(newNote)
        let item = this.cartItems.get(product.id)
        if (item === undefined) {
            this.cartItems.set(product.id, {...product, note: newNote, wantedQuantity: 1})
        }else {
            this.cartItems.set(product.id, {...item, note: newNote})
        }
    }

    @action.bound increment(p: ProductInterface) {
        let item = this.cartItems.get(p.id)
        if (item === undefined) {
            this.cartItems.set(p.id, {...p, wantedQuantity: 1, note: ""})
        }else {
            this.cartItems.set(p.id, {...item, wantedQuantity: item.wantedQuantity + 1})
        }
    }

    @action.bound decrement(p: ProductInterface) {
        let item = this.cartItems.get(p.id)
        if (item === undefined) {
            //do nothing
        }else {
            if (item.wantedQuantity === 1) {
                this.cartItems.delete(p.id)
                return
            }
            this.cartItems.set(p.id, {...item, wantedQuantity: item.wantedQuantity - 1})
        }
    }

    @computed get isActive() {
        return this.cartItems.size > 0
    }

    @action.bound removeProduct(id: string) {
        return this.cartItems.delete(id)
    }

    @action.bound cancel() {
        this.cartItems.clear()
    }

    @action.bound orderPlaced() {
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
            ar.push({wantedQuantity: value.wantedQuantity, product_id: value.id, note: value.note})
        })

        return ar
    }
}

export class MultiStore {
    @observable stores: Map<number, CartStore> = new Map<number, CartStore>();

    @action.bound getStore(table: number) {
        table = Number(table)
        let item = this.stores.get(table)
        if (item === undefined) {
            let newStore = new CartStore(table)
            this.stores.set(table, newStore)
            return newStore
        }

        return item
    }
}


const multi = new MultiStore();

export default multi