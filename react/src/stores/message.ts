import { observable, computed, action } from "mobx"
import config from "./config";

export class MessageStore {
    @observable type: "success" | "info" | "fail" | "log" = "info"
    @observable message: string = ""
    @observable visible: boolean = false
    private toDismiss: string = "n/a"

    @computed get isVisible() {
        return this.visible
    }
    @computed get isSuccess() {
        return this.type === "success"
    }
    @computed get isFail() {
        return this.type === "fail"
    }
    @computed get isInfo() {
        return this.type === "info"
    }

    @action.bound private dismissAfterTimeout(msg: string) {
        if (this.message === msg) {
            this.dismiss()
        }
    }

    @action.bound private setMessage(type: "success" | "info" | "fail" | "log", msg: string) {
        if (config.isDebugMode) {
            console.log("setting message", type, msg)
        }

        if (type === "log") {
            return
        }

        if (this.message === msg) {
            msg = msg + " (!)"
        }else {
            msg = msg
        }

        this.message = msg
        this.visible = true
        this.type = type

        if (config.clearMessages) {
            setTimeout(() => {this.dismissAfterTimeout(msg)}, config.messageTimeout)
        }
    }
    
    @action.bound setSuccess(msg: string) {
        this.setMessage("success", msg)
    }
    @action.bound setFail(msg: string) {
        this.setMessage("fail", msg)
    }
    @action.bound setInfo(msg: string) {
        this.setMessage("info", msg)
    }
    @action.bound setLog(msg: string) {
        this.setMessage("log", msg)
    }

    @action.bound dismiss() {
        this.visible = false
    }
}

const store = new MessageStore();
export default store