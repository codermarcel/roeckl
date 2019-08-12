import { action, computed, observable } from "mobx";
import axiosInstane from "../../stores/axios";
import msgStore from "../../stores/message";

export interface OrderInterface {
    id: string
    user_id: string
    created_at: number
    updated_at: number
    status: string
    total_cost: number
    table_id: number
}

export class OrderStore {
    @observable page: number = 0
    @observable orders: Map<string, OrderInterface> = new Map<string, OrderInterface>()

    @computed get ordersArray() {
        return Array.from(this.orders.values())
    }

    @action.bound findOrder(id: string) {
        return this.orders.get(id)
    }

    @action.bound setMap(ar: OrderInterface[]) {
        let nm: Map<string, OrderInterface> = new Map<string, OrderInterface>()
        ar.forEach((value) => {
            nm.set(value.id, value)
        })

        this.orders = nm
    }


    @computed get tableSumsMap() {
        let dat = new Map<number, number>()

        this.ordersArray.forEach((order) => {
            let item = dat.get(order.table_id)
            if (item === undefined) {
                dat.set(order.table_id, order.total_cost)
            } else {
                dat.set(order.table_id, item + order.total_cost)
            }
            
        })
        return dat
    }

    @computed get ordersPieData() {
        let dat = new Map<number, number>()

        this.ordersArray.forEach((order) => {
            let item = dat.get(order.table_id)
            if (item === undefined) {
                dat.set(order.table_id, order.total_cost)
            } else {
                dat.set(order.table_id, item + order.total_cost)
            }
            
        })

        let ar = []
        dat.forEach((value, key) => {
            let b = []
            b.push("Table " + key, value /100)
            ar.push(b)
        })

        return ar
    }

    @action.bound loadOrders() {
       
        const data = {page: this.page}

        axiosInstane.post("/waiter/orders?page=" +this.page, data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Success! Order history loaded")
                this.setMap(response.data.data.orders)
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })

    }

    @action.bound setPage(page: number) {
        this.page = page
    }
}

const store = new OrderStore();
export default store