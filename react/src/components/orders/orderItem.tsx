import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import config from "../../stores/config";
import { convertUnixToDate } from "../../helpers/time";

interface Props extends RouteComponentProps{
    orderID: string
    price: number
    date: number //unix timestamp
}

@observer
class OrderItem extends React.Component<Props> {
    render() {
        const {orderID, price, date} = this.props
        return (
            <Table.Row>
                <Table.Cell>{orderID}</Table.Cell>
                <Table.Cell>{config.formatPrice(price)}</Table.Cell>
                <Table.Cell>{convertUnixToDate(date)}</Table.Cell>
                <Table.Cell>
                    <Button size="large" primary onClick={(e) => this.props.history.push("/orders/" + orderID)}>View Order Details</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default withRouter(OrderItem);