import { action, computed, observable } from "mobx";
import { ValidAddress, ValidFirstName, ValidInfo, ValidLastName, ValidPhone, ValidStreet } from "../helpers/checkoutValidation";
import axiosInstane from "./axios";
import cartStore from "./cart";
import msgStore from "./message";


export class CheckoutStore {
    @observable private activeStep: "shipping" | "confirm" = "shipping"
    
    @observable firstName: string = ""
    @observable lastName: string = ""
    @observable street: string = ""
    @observable address: string = ""
    @observable phone: string = ""
    @observable info: string = ""

    @observable firstNameError = null
    @observable lastNameError = null
    @observable streetError = null
    @observable addressError = null
    @observable phoneError = null
    @observable infoError = null

    @computed get isAtShipping() {
        return this.activeStep === "shipping"
    }
    @computed get isAtConfirm() {
        return this.activeStep === "confirm"
    }

    @action.bound checkShipping(): boolean {
        this.firstNameError = ValidFirstName(this.firstName)
        this.lastNameError = ValidLastName(this.lastName)
        this.streetError = ValidStreet(this.street)
        this.addressError = ValidAddress(this.address)
        this.phoneError = ValidPhone(this.phone)
        this.infoError = ValidInfo(this.info)

        return this.firstNameError === null && this.lastNameError === null && this.streetError === null && this.addressError === null
    }

    @action.bound confirmOrder(history) {
        if (this.isAtShipping) {
            msgStore.setFail("Please go to the confirm step first.")
            return
        }

        if (cartStore.uniqueProductsInCart < 1) {
            msgStore.setFail("Please select products to purchase before you continue")
            return
        }

        const shippingData = {firstName: this.firstName, lastName: this.lastName, address: this.address, street: this.street, phone: this.phone, info: this.info}
        const data = {products: cartStore.wantedProductsArray, shipping: shippingData, expectedPrice: cartStore.totalCost}

        axiosInstane.post("/user/purchase", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Success! Your order should be on its way now!")
                //preserve this order, if you reset before you push, then you will load the categories and products again
                history.push("/orders")
                this.reset()
                cartStore.reset()
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })

    }

    @action.bound nextStep() {
        if (this.isAtShipping && this.checkShipping()) {
            this.activeStep = "confirm"
        }
    }
    @action.bound previousStep() {
        if (this.isAtConfirm) {
            this.activeStep = "shipping"
        }
    }

    @action.bound setFirstName(input: string) {
        this.firstName = input
    }
    @action.bound setAddress(input: string) {
        this.address = input
    }
    @action.bound setLastName(input: string) {
        this.lastName = input
    }
    @action.bound setStreet(input: string) {
        this.street = input
    }

    @action.bound setPhone(input: string) {
        this.phone = input
    }
    @action.bound setInfo(input: string) {
        this.info = input
    }

    @action.bound reset() {
        this.street = ""
        this.address = ""
        this.firstName = ""
        this.lastName =""
        this.phone =""
        this.info =""
        this.activeStep = "shipping"
    }
}

const store = new CheckoutStore();
export default store