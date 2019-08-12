import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Table } from "semantic-ui-react";
import Page from "../Page";
import OrderItem from "./orderItem";
import store from "./orderStore"

@observer
class TestApp extends React.Component<RouteComponentProps> {
    componentDidMount() {
        store.loadOrders()
    }
    render() {
        let totalItems = store.ordersArray.length
        if (totalItems < 1) {
            return (
                <Page>
                <Container>
                <h1>No Orders placed yet</h1>
                </Container>
            </Page>
            )
        }
        return (
            <Page>
                <Container>
                    <Table striped celled size="large" color="red">
                        <Table.Header>
                        <Table.Row style={{fontSize: "24px"}}>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Amount Paid</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>More Info</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body style={{fontSize: "20px"}}>
                        {store.ordersArray.map((order) => (
                              <OrderItem key={order.id} orderID={order.id} price={order.total_cost} date={order.created_at}/>

                        ))}
                        </Table.Body>

                    </Table>
                </Container>
            </Page>
        );
    }
}

export default withRouter(TestApp);