import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Segment, Table } from 'semantic-ui-react';
import cartStore from "../../stores/cart";
import config from "../../stores/config";

@observer
class ShippingContent extends React.Component<RouteComponentProps> {

    render() {
        return (
            <div>
                <Segment attached style={{padding: "3em"}} height="500">
                <Table celled size="large" color="blue">
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Produt Name</Table.HeaderCell>
                        <Table.HeaderCell>Produt ID</Table.HeaderCell>
                        <Table.HeaderCell>Product Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Product Price</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        
                    {cartStore.cartItemArray.map((value, key) => (
                        <Table.Row key={value.id}>
                            <Table.Cell>{value.name}</Table.Cell>
                            <Table.Cell>{value.id}</Table.Cell>
                            <Table.Cell>{value.wantedQuantity}</Table.Cell>
                            <Table.Cell>{config.formatPrice(value.price * value.wantedQuantity)}</Table.Cell>
                        </Table.Row>
                    ))}

                    <Table.Row>
                        <Table.Cell>---</Table.Cell>
                        <Table.Cell>---</Table.Cell>
                        <Table.Cell>---</Table.Cell>
                        <Table.Cell>---</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell> <strong>Total:</strong></Table.Cell>
                        <Table.Cell> <strong>{config.formatPrice(cartStore.totalCost)}</strong></Table.Cell>
                    </Table.Row>

                    </Table.Body>

                </Table>
                </Segment>
            </div>
        );
    }
}


export default withRouter(ShippingContent);