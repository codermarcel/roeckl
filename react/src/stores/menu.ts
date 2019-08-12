import { observable, computed, action } from "mobx"

export class MenuStore {
    @observable activeItem: string = ""

    @action.bound changeActiveItem(newPath: string) {
        this.activeItem = newPath
    }
}

const store = new MenuStore();
export default store