import 'chart.js';
import { observer } from "mobx-react";
import React from 'react';
import { LineChart, PieChart } from 'react-chartkick';
import 'chart.js'
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Card, Container, Grid, Table } from "semantic-ui-react";
import Page from "../Page";
import OrderItem from "./orderItem";
import store from "./orderStore";

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

        let ordersPieData = store.ordersPieData
        const showCharts = store.ordersArray.length >0 && ordersPieData.length > 0
        const pieChart = (
            <Card fluid>
                <Card.Content>
                <Card.Header textAlign="center">Earnings per Table in Euro</Card.Header>
                <Card.Meta>
                    {/* <span className='date'>Joined in 2015</span> */}
                </Card.Meta>
                <Card.Description>
                    {/* Matthew is a musician living in Nashville. */}
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <PieChart data={ordersPieData} />
                </Card.Content>
            </Card>
        )

        return (
            <Page>
                <Container>
                    <Grid columns="equal">
                        <Grid.Row verticalAlign="middle">
                            <Grid.Column>
                                {showCharts ? pieChart : null}
                            </Grid.Column>


                            <Grid.Column>
                                {showCharts ? <LineChartComp /> : null}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Table striped celled size="large" color="red">
                        <Table.Header>
                            <Table.Row style={{fontSize: "24px"}}>
                                <Table.HeaderCell>Table</Table.HeaderCell>
                                {/* <Table.HeaderCell>Order ID</Table.HeaderCell> */}
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
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


@observer
class LineChartComp extends React.Component {
    render() {
        let lineData = store.getLineChartDataFromArray(store.testDataArray)
        // let lineData = store.getLineChartDataFromArray(store.ordersArray)
        return (
            <Card fluid>
                <Card.Content>
                <Card.Header textAlign="center">Earnings over time</Card.Header>
                <Card.Meta>
                </Card.Meta>
                <Card.Description>
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <LineChart data={lineData} />
                </Card.Content>
            </Card>
        )
    }
}

export default withRouter(TestApp);