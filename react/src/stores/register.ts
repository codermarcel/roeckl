import { action, computed, observable } from "mobx";

export class RegisterStore {
    @observable email: string = ""
    @observable username: string = ""
    @observable password: string = ""

    @observable emailError = null
    @observable usernameError = null
    @observable passwordError = null


    @action.bound register(history) {
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