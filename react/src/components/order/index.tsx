import { observer } from "mobx-react";
import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import OrderPage from "./page";
import ordersStore from "../orders/orderStore"
import store from "./store"
import msgStore from "../../stores/message"
import Page from "../Page"
import { Container } from "semantic-ui-react";

@observer
class TestApp extends React.Component<RouteComponentProps> {
    componentDidMount() {
        store.loadOrderProducts(this.props.match.params["id"])
    }
    render() {
        const orderID = this.props.match.params["id"]

        if (orderID === undefined) {
            msgStore.setFail("order id not found")
            return <Redirect to="/orders"/>
        }
        
        const order = ordersStore.findOrder(orderID)

        if (order === undefined) {
            msgStore.setFail("order not found")
            return <Redirect to="/orders"/>
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
        const firstName = order.shipping_first_name
        const lastName = order.shipping_last_name
        const address = order.shipping_address
        const street = order.shipping_street
        const phone = order.shipping_phone
        const info = order.shipping_info

        return (
            <OrderPage 
                orderDetails={{products,totalPaid}}
                shippingDetails={{firstName, lastName, address, street, phone, info}}
                orderID={orderID}
                unixPurchase={unixPurchase} 
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