import { action, observable } from "mobx";
import msgStore from "../../stores/message";
import axiosInstane from "../../stores/axios";
import config from "../../stores/config";

export interface ProductInterface {
    id: string
    name: string
    avatar: string
    quantity: number
    description: string
    category: string
    price: number
    disabled: boolean
}

export interface Category {
    category: string
}

export class ProductStore {
    @observable page: number = 1
    @observable hasMore: boolean = false
    @observable products: ProductInterface[] = []
    @observable categories: Category[] = [{category: "food"}]
    @observable selectedCategory: string = ""

    findProduct(id: string) : ProductInterface | undefined {
        let product = undefined
        this.products.forEach((value, key) => {
            if (value.id == id) {
                product = value
            }
        })

        return product
    }

    @action.bound selectAvailableCategory() {
        let found = false
        this.categories.forEach((value) => {
            if (value.category === this.selectedCategory) {
                found = true
            }
        })

        if (!found && this.categories.length > 0) {
            this.selectedCategory =  this.categories[0].category
        }
    }

    @action.bound getInitial() {
        this.getCategories().then(() => {

            if (this.selectedCategory === "") {
                if (this.categories.length > 0) {
                    this.selectedCategory = this.categories[0].category
                }
            }

            this.selectAvailableCategory()
            this.getProducts()
        })
    }

    @action.bound getProducts() {
        return axiosInstane.get("/owner/products?page=" + (this.page - 1) + "&category=" + this.selectedCategory)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Successfully loaded Products for owner")
                this.page = response.data.data.page + 1
                this.hasMore = response.data.data.hasMore
                let p = response.data.data.products.map((item) => {
                    return {...item, avatar: this.getAvatar(item.id)}
                })
                this.products = p
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }

    @action.bound getCategories() {
        return axiosInstane.get("/owner/categories")
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Successfully loaded categories")
                this.categories = response.data.data
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }

    @action.bound setPage(value: number) {
        this.page = value
        this.getProducts()
    }
    @action.bound setCategory(value: string) {
        this.selectedCategory = value
        this.getProducts()
    }
    @action.bound clearProducts() {
        this.products = []
    }
    @action.bound clearCategories() {
        this.categories = []
    }
    @action.bound getAvatar(productID: string) {
        return config.getBasePath() + "/product/" + productID+ "/avatar"
    }
}

const store = new ProductStore();

export default store