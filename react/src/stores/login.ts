import { action, computed, observable } from "mobx";

export class LoginStore {
    @observable email: string = ""
    @observable username: string = ""
    @observable password: string = ""

    @observable emailError = null
    @observable usernameError = null
    @observable passwordError = null

    @action.bound checkEmail(): boolean {
        if (!this.email || this.email.length < 8 || this.email.length > 40) {
            this.emailError = {content: "Email needs to be at least 8 and at most 40 characters long", poiting: "below"}
            return false
        }
        if (!this.email.includes("@") || !this.email.includes(".")) {
            this.emailError = {content: "Email is not valid", poiting: "below"}
            return false
        }
        
        this.emailError = null
        return true
    }

    @action.bound checkUsername(): boolean {
        if (!this.username || this.username.length < 5 || this.username.length > 30) {
            this.usernameError = {content: "Username needs to be at least 5 and at most 30 characters long", poiting: "below"}
            return false
        }
        
        this.usernameError = null
        return true
    }

    @action.bound checkPassword(): boolean {
        if (!this.password || this.password.length < 6 || this.password.length > 99) {
            this.passwordError = {content: "Username needs to be at least 6 and at most 99 characters long", poiting: "below"}
            return false
        }
        
        this.passwordError = null
        return true
    }

    @action.bound login(history) {
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

const store = new LoginStore();

export default store