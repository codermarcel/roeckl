import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import { convertUnixToDate } from "../../helpers/time";
import config from "../../stores/config";

interface Props extends RouteComponentProps{
    table: number
    orderID: string
    price: number
    date: number //unix timestamp
    status: string
}

@observer
class OrderItem extends React.Component<Props> {
    render() {
        const {orderID, price, date, table, status} = this.props
        return (
            <Table.Row>
                <Table.Cell>{table}</Table.Cell>
                {/* <Table.Cell>{orderID}</Table.Cell> */}
                <Table.Cell>{config.formatPrice(price)}</Table.Cell>
                <Table.Cell>{convertUnixToDate(date)}</Table.Cell>
                <Table.Cell>
                    <Button size="large" primary onClick={(e) => this.props.history.push("/orders-chef/" + orderID)}>View Order Details</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default withRouter(OrderItem);