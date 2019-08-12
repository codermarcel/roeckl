import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Table, Button } from "semantic-ui-react";
import Page from "../Page";
import OrderItem from "./orderItem";
import store from "./orderStore"
import config from "../../stores/config"

@observer
class TestApp extends React.Component<RouteComponentProps> {
    state = {name: "Disable Auto Refresh", autoRefresh:true}
    timeout
    loopUpdate = () => {
        store.loadOrders()
        this.timeout = setTimeout(this.loopUpdate, config.ordersRefreshMs)
    }
    componentDidMount() {
        this.loopUpdate()
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
    }
    refreshClick = () => {
        if (this.state.autoRefresh) {
            clearTimeout(this.timeout)
            this.setState({name: "Enable Auto Refresh", autoRefresh: false})
        }else {
            this.loopUpdate()
            this.setState({name: "Disable Auto Refresh", autoRefresh: true})
        }
    }
    render() {
        const positive = !this.state.autoRefresh
        const negative = this.state.autoRefresh
        let totalItems = store.ordersArray.length
        
        if (totalItems < 1) {
            return (
                <Page>
                    <Container>
                    <Button onClick={this.refreshClick} positive={positive} negative={negative} size="huge">{this.state.name}</Button>
                    <h1>No Orders placed yet</h1>
                    </Container>
                </Page>
            )
        }

        return (
            <Page>
                <Container>
                    <Button onClick={this.refreshClick} positive={positive} negative={negative} size="huge">{this.state.name}</Button>
                    <Table striped celled size="large" color="red">
                        <Table.Header>
                        <Table.Row style={{fontSize: "24px"}}>
                            <Table.HeaderCell>Table</Table.HeaderCell>
                            {/* <Table.HeaderCell>Order ID</Table.HeaderCell> */}
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>More Info</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body style={{fontSize: "20px"}}>
                        {store.ordersArray.map((order) => (
                              <OrderItem status={order.status} table={order.table_id} key={order.id} orderID={order.id} price={order.total_cost} date={order.created_at}/>

                        ))}
                        </Table.Body>

                    </Table>
                </Container>
            </Page>
        );
    }
}

export default withRouter(TestApp);