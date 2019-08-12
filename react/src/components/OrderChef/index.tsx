import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container } from "semantic-ui-react";
import msgStore from "../../stores/message";
import ordersStore from "../OrdersChef/orderStore";
import Page from "../Page";
import OrderPage from "./page";
import store from "./store";

@observer
class TestApp extends React.Component<RouteComponentProps> {
    componentDidMount() {
        store.loadOrderProducts(this.props.match.params["id"])
    }
    render() {
        const orderID = this.props.match.params["id"]
        if (orderID === undefined) {
            msgStore.setFail("order id not found")
            return (
                <Page>
                    <Container>
                    <h1>Order not found</h1>
                    </Container>
                </Page>
            )
        }
        
        const order = ordersStore.findOrder(orderID)

        if (order === undefined) {
            msgStore.setFail("order not found")
            return (
                <Page>
                    <Container>
                    <h1>Order not found</h1>
                    </Container>
                </Page>
            )
        }

        if (store.orderProducts.length < 1) {
            return (
                <Page>
                    <Container>
                        <h1>No Products found for this Order</h1>
                    </Container>
                </Page>
            )
        }

        const products = store.orderProducts
        const unixPurchase = order.created_at
        const totalPaid = order.total_cost
        const cancelFunc = store.cancelOrder
        const status = order.status


        return (
            <OrderPage 
                orderDetails={{products,totalPaid}}
                orderID={orderID}
                unixPurchase={unixPurchase} 
                cancelFunc={cancelFunc}
            />
        );
    }
}

export default withRouter(TestApp);