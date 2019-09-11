import { action, observable } from "mobx";
import { ValidDescription, ValidName, ValidPrice, ValidQuantity, ValidCategory } from "../../helpers/createProductValidation";
import axiosInstane from "../../stores/axios";
import msgStore from "../../stores/message";

export class CreateProductStore {
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

    @action.bound setName(input: string) {
        this.name = input
    }
    @action.bound setCategory(input: string) {
        this.category = input
    }
    @action.bound setDescription(input: string) {
        this.description = input
    }
    @action.bound setPrice(input: string) {
        this.price = Number(input)
    }
    @action.bound setQuantity(input: string) {
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

        if (this.avatarFile == null) {
            msgStore.setFail("Please pick a valid avatar")
            return false
        }

        return this.nameError == null && this.descriptionError == null && this.priceError == null && this.quantityError == null
    }

    @action.bound createProduct() {
        if (!this.check()) {
            return
        }

        let fd = new FormData();
        fd.append("avatar", this.avatarFile)
        
        const dat = {price: this.price,
            quantity: this.quantity,
            enabled: this.enabled,
            description: this.description,
            name: this.name,
            category: this.category
        }

        fd.append("details", JSON.stringify(dat))

        axiosInstane.post("/owner/create-product", fd)
        .then((response) => {
            if (response.data.success) {
                msgStore.setLog("Successfully created Product!")
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

const store = new CreateProductStore();

export default store