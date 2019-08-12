import 'chart.js';
import { observer } from "mobx-react";
import React from 'react';
import { PieChart } from 'react-chartkick';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Card, Container, Divider, Header, Icon, Table } from "semantic-ui-react";
import config from "../../stores/config";
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
        const showCharts = store.ordersArray.length >0
        const pieChart = (
            <Card fluid>
                <Card.Content>
                <Card.Header textAlign="center">Sum per table in Euro</Card.Header>
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
                    <Table striped celled size="large" color="red">
                        <Table.Header>
                        <Table.Row style={{fontSize: "24px"}}>
                            <Table.HeaderCell>Table</Table.HeaderCell>
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

                    <SumTable />

                </Container>
            </Page>
        );
    }
}


@observer
class  SumTable extends React.Component {
  render() {
    const tableSumsMap = store.tableSumsMap
    let items = []
    tableSumsMap.forEach((value, key) => {
        items.push(
            <Table.Row key={key}>
                <Table.Cell width={5}>Table {key}</Table.Cell>
                <Table.Cell>{config.formatPrice(value)}</Table.Cell>
            </Table.Row>
        )
    })
    return (
        <div style={{maxWidth: "600px", margin: "1em 0em 0em 0em", fontSize: "2em"}}>
            <Divider horizontal>
                <Header as='h4'>
                <Icon name='tag' />
                Sums
                </Header>
            </Divider>

            <Table definition floated="left">
                <Table.Body>

                   {items}

                </Table.Body>
            </Table>
        </div>
    )
  }
}


export default withRouter(TestApp);