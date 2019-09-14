import { observer } from "mobx-react";
import React from 'react';
import { Table } from "semantic-ui-react";
import config from "../../stores/config";
import { OrderProductInterface } from "./store"

export interface OrderProps {
    products: OrderProductInterface[]
    totalPaid: number
}

@observer
class OrderItem extends React.Component<OrderProps> {
    render() {
        const {products, totalPaid} = this.props

        return (
            <Table basic="very" striped size="large" style={{padding: "1em 1em"}}>
                <Table.Header>
                <Table.Row>
                    {/* <Table.HeaderCell>Produt ID</Table.HeaderCell> */}
                    <Table.HeaderCell>Produt Name</Table.HeaderCell>
                    <Table.HeaderCell>Product Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Note</Table.HeaderCell>
                    <Table.HeaderCell>Paid</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                    
                {products.map((value, key) => (
                    <Table.Row key={value.id}>
                        {/* <Table.Cell>{value.id}</Table.Cell> */}
                        <Table.Cell>{value.product_name}</Table.Cell>
                        <Table.Cell>{value.quantity}</Table.Cell>
                        <Table.Cell>{value.note}</Table.Cell>
                        <Table.Cell>{config.formatPrice(value.cents_paid)}</Table.Cell>
                    </Table.Row>
                ))}

                <Table.Row>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell> <strong>Total:</strong></Table.Cell>
                    <Table.Cell> <strong>{config.formatPrice(totalPaid)}</strong></Table.Cell>
                </Table.Row>

                </Table.Body>

            </Table>
        );
    }
}


export default OrderItem;