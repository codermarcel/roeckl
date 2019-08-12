import { action, computed, observable } from "mobx";
import { convertUnixToDate } from "../../helpers/time";
import axiosInstane from "../../stores/axios";
import config from "../../stores/config";
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

const StatusProcessing = "processing"
const StatusPaid = "paid"



export class OrderStore {
    @observable page: number = 0
    @observable orders: Map<string, OrderInterface> = new Map<string, OrderInterface>()

    @computed get ordersArray() {
        return Array.from(this.orders.values())
    }

    get testDataArray() {
        let testData: OrderInterface[] = []
        let t1 = {id: "12345", user_id: "userid", created_at: 1565000212, updated_at: 1565000212, status: "paid", total_cost: 5, table_id: 2}
        testData.push({...t1, created_at: 1552780800, total_cost: 1000})
        testData.push({...t1, created_at: 1552867200, total_cost: 2000})
        testData.push({...t1, created_at: 1552953600, total_cost: 3000})
        return testData
    }

    getLineChartDataFromArray(data: OrderInterface[]) {
        let dat = new Map<string, number>()

        data.forEach((order) => {
            if (order.status !== StatusPaid) {
                return
            }
            let date = convertUnixToDate(order.created_at)
            let item = dat.get(date)
            if (item === undefined) {
                dat.set(date, order.total_cost)
            } else {
                dat.set(date, item + order.total_cost)
            }
            
        })

        let ob = {}
        dat.forEach((value, key) => {
            ob[key] = config.formatPrice(value)
        })

        return ob
    }

    @computed get ordersLineChartData() {
        return this.getLineChartDataFromArray(this.ordersArray)
    }

    @computed get ordersPieData() {
        let dat = new Map<number, number>()

        this.ordersArray.forEach((order) => {
            if (order.status !== StatusPaid) {
                return
            }
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

    @action.bound loadOrders() {
       
        const data = {page: this.page}

        axiosInstane.post("/owner/orders?page=" +this.page, data)
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