import { action, observable } from "mobx";
import axiosInstane from "../../stores/axios";
import msgStore from "../../stores/message";

export interface OrderProductInterface {
    id: string
    order_id: string
    product_id: string
    product_name: string
    quantity: number
    cents_paid: number
    created_at: number
    note: string
}

export class OrderStore {
    @observable orderProducts: OrderProductInterface[] = []

    @action.bound loadOrderProducts(order_id: string) {
        const data = {order_id: order_id}
        axiosInstane.post("/chef/order", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Success! Order Products loaded")
                this.orderProducts = response.data.data
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })

    }

    @action.bound cancelOrder(order_id: string, history) {
        const data = {order_id: order_id}
        axiosInstane.post("/chef/order/cancel", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Success! Order canceled")
                history.push("/orders-waiter")
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })

    }
}

const store = new OrderStore();
export default store