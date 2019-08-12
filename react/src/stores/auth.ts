import { action, computed, observable } from "mobx";


const authKeyName = "authdata:1"

class PersistStore {
    save(key: string, data: string) {

    }
}

export class AuthStore {
    @observable id: string = ""
    @observable email: string = ""
    @observable username: string = ""
    @observable jwt: string = ""
    @observable role: string = "guest"
    @observable authenticated: boolean = false

    constructor() {
        this.loadAuthData()
    }

    private loadAuthData() {
        const j = JSON.parse(localStorage.getItem(authKeyName))

        if (j !== null && j.jwt !== undefined && j.jwt !== "") {
            this.id = j.id
            this.email = j.email
            this.username = j.username
            this.jwt = j.jwt
            this.role = j.role
            this.authenticated = j.authenticated
        }
    }

    private storeAuthData() {
        let t = {
            id: this.id,
            email: this.email,
            username: this.username,
            jwt: this.jwt,
            role: this.role,
            authenticated: this.authenticated
        }

        localStorage.setItem(authKeyName, JSON.stringify(t))
    }

    private clearAuthData() {
        localStorage.removeItem(authKeyName)
    }

    @computed get isGuest() {
        if (this.isUser || this.isWaiter || this.isOwner || this.isChef || this.authenticated) {
            return false
        }

        return true
    }
    @computed get isUser() {
        return this.role === "user" && this.authenticated
    }
    @computed get isWaiter() {
        return this.role === "waiter" && this.authenticated
    }
    @computed get isOwner() {
        return this.role === "owner" && this.authenticated
    }
    @computed get isChef() {
        return this.role === "chef" && this.authenticated
    }

    @action.bound logout() {
        this.jwt = ""
        this.authenticated = false
        this.role = "guest"
        this.clearAuthData()
    }

    @action.bound setAuthenticated(username: string, email: string, id: string, role: string, jwt: string) {
        this.username = username
        this.email = email
        this.id = id
        this.role = role
        this.jwt = jwt
        this.authenticated = true
        this.storeAuthData()
    }
}

const store = new AuthStore();

export default store