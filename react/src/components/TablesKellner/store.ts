import { action, computed, observable } from "mobx";
import { number } from "prop-types";

export interface TableInterface {
    active: boolean
    products: Product[]
}

export interface Product {
    id: string
    quantity: number
}

export class TableStore {
    @observable tables: Map<number, TableInterface> = new Map<number, TableInterface>()

    @action.bound setActive(tableid: number) {
        tableid = Number(tableid)
        this.tables.set(tableid, {active: true, products: null})
    }

    @action.bound tableDone(tableid: number) {
        tableid = Number(tableid)
        this.tables.set(tableid, {active: false, products: null})
    }

    @action.bound tableCancel(tableid: number) {
        tableid = Number(tableid)
        this.tables.delete(tableid)
    }

    @computed get activeTables() {
        return Array.from(this.tables.keys())
    }
}

const store = new TableStore();

export default store