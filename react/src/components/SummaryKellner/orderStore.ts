import { action } from "mobx";
import axiosInstane from "../../stores/axios";
import multiStore from "../../stores/CartKellner";
import msgStore from "../../stores/message";


export class CheckoutStore {
    @action.bound placeOrder(tableid: number, history: any) {
        tableid = Number(tableid)

        let cartStore = multiStore.getStore(tableid)

        if (cartStore.uniqueProductsInCart < 1) {
            msgStore.setFail("Please select products to purchase before you continue")
            return
        }

        const data = {products: cartStore.wantedProductsArray, expectedPrice: cartStore.totalCost, tableid: tableid}

        axiosInstane.post("/waiter/purchase", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setSuccess("Success! Order placed.")
                //preserve this order
                history.push("/orders-waiter")
                cartStore.orderPlaced()
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

const store = new CheckoutStore();
export default store