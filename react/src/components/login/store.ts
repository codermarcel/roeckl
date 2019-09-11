import { action, computed, observable } from "mobx";
import { checkEmail, checkPassword } from "../../helpers/userValidation";
import axiosInstane from "../../stores/axios";
import msgStore from "../../stores/message";
import authStore from "../../stores/auth"

export class AuthStore {
    @observable email: string = "tim@waiter.com"
    @observable password: string = "123456"
    @observable emailError = null
    @observable passwordError = null

    @action.bound check() {
        this.emailError = checkEmail(this.email)
        this.passwordError = checkPassword(this.password)

        return this.emailError === null && this.passwordError === null
    } 

    @action.bound login(history) {
        if (!this.check()) {
            return
        }

        const data = {password: this.password, email: this.email}

        axiosInstane.post("/login", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setLog("Successfully logged in!")
                let u = response.data.data.user
                let jwt = response.data.data.jwt
                authStore.setAuthenticated(u.username, u.email, u.id, u.role, jwt)
                history.push("/profile")

            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }

    @action.bound setEmail(input: string) {
        this.email = input
    }
    @action.bound setPassword(input: string) {
        this.password = input
    }
}

const store = new AuthStore();

export default store