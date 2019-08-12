import { action, observable } from "mobx";
import { checkEmail, checkPassword, checkUsername } from "../../helpers/userValidation";
import axiosInstane from "../../stores/axios";
import msgStore from "../../stores/message";

export class RegisterStore {
    @observable email: string = ""
    @observable username: string = ""
    @observable password: string = ""

    @observable emailError = null
    @observable usernameError = null
    @observable passwordError = null

    @action.bound check() {
        this.emailError = checkEmail(this.email)
        this.usernameError = checkUsername(this.username)
        this.passwordError = checkPassword(this.password)

        return this.emailError === null && this.usernameError === null && this.passwordError === null
    } 

    @action.bound register(history) {
        if (!this.check()) {
            return
        }

        const data = {username: this.username,
            password: this.password,
            email: this.email
        }

        axiosInstane.post("/register", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Successfully registered new account!")
                history.push("/login")
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }

    @action.bound setUsername(input: string) {
        this.username = input
    }
    @action.bound setEmail(input: string) {
        this.email = input
    }
    @action.bound setPassword(input: string) {
        this.password = input
    }
}

const store = new RegisterStore();

export default store