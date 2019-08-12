import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container } from "semantic-ui-react";
import msgStore from "../../stores/message";
import ordersStore from "../OrdersKellner/orderStore";
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
        const markAsPaidFunc = store.markOrderAsPaid
        const status = order.status


        return (
            <OrderPage 
                orderDetails={{products,totalPaid}}
                orderID={orderID}
                unixPurchase={unixPurchase} 
                cancelFunc={cancelFunc}
                markPaidFunc={markAsPaidFunc}
            />
        );
    }
}



// @observer
// class TestApp extends React.Component<RouteComponentProps> {
//     render() {
//         const orderID = this.props.match.params["id"]
//         if (orderID === undefined) {
//             return <Redirect to="/orders"/>
//         }

//         const products = [{id: "12345", name: "name123", pricePaid: 10, quantityBought: 5}]

//         return (
//             <Page>
//                 <Container style={{marginTop: "2em"}}>
//                     <ShippingItem />
//                     <Divider horizontal style={{marginTop: "2em"}}>
//                         <Header as='h4'>
//                             <Icon name='tag' />
//                             Product Info
//                         </Header>
//                     </Divider>
//                     <OrderItem products={products} />
//                 </Container>
//             </Page>
//         );
//     }
// }

export default withRouter(TestApp);