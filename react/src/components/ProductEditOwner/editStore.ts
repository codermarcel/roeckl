import { action, observable } from "mobx";
import { ValidDescription, ValidName, ValidPrice, ValidQuantity, ValidCategory } from "../../helpers/createProductValidation";
import axiosInstane from "../../stores/axios";
import msgStore from "../../stores/message";

export class EditStore {
    @observable id: string = ""
    @observable name: string = ""
    @observable description: string = ""
    @observable price: number = 100
    @observable quantity: number = 1
    @observable enabled: boolean = true
    @observable avatarFile: File = null
    @observable category: string = ""

    @observable nameError = null
    @observable descriptionError = null
    @observable priceError = null
    @observable quantityError = null
    @observable enabledError = null
    @observable categoryError = null

    @action.bound setID(input: string) {
        this.id = input
    }
    @action.bound setName(input: string) {
        this.name = input
    }
    @action.bound setCategory(input: string) {
        this.category = input
    }
    @action.bound setDescription(input: string) {
        this.description = input
    }
    @action.bound setPrice(input: string | number) {
        this.price = Number(input)
    }
    @action.bound setQuantity(input: string | number) {
        this.quantity = Number(input)
    }
    @action.bound setEnabled(input: boolean) {
        this.enabled = input
    }
    @action.bound setAvatarFile(input: File) {
        this.avatarFile = input
    }

    @action.bound check(): boolean {
        this.nameError = ValidName(this.name)
        this.categoryError = ValidCategory(this.category)
        this.descriptionError = ValidDescription(this.description)
        this.priceError = ValidPrice(this.price)
        this.quantityError = ValidQuantity(this.quantity)

        return this.nameError == null && this.descriptionError == null && this.priceError == null && this.quantityError == null
    }

    @action.bound updateProduct() {
        if (!this.check()) {
            return
        }

        let fd = new FormData();
        if (this.avatarFile !== null && this.avatarFile !== undefined) {
            fd.append("avatar", this.avatarFile)
        }
        
        const dat = {
            id: this.id,
            price: this.price,
            quantity: this.quantity,
            enabled: this.enabled,
            description: this.description,
            name: this.name,
            category: this.category
        }

        fd.append("details", JSON.stringify(dat))

        axiosInstane.post("/owner/product/update", fd)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Successfully updated Product!")
                return
            }
            msgStore.setFail(response.data.message)
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }


    @action.bound deleteProduct(history) {
        const dat = {product_id: this.id}

        axiosInstane.post("/owner/product/delete", dat)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Successfully deleted Product!")
                history.push("/products-owner")
                return
            }
            msgStore.setFail(response.data.message)
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }
}

const store = new EditStore();

export default store