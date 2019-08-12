import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Divider, Header, Segment } from "semantic-ui-react";
import Page from "../Page";
import OrderItem, { OrderProps } from "./order";
import Shipping, { ShippingInfoInterface } from "./shipping";
import { convertUnixToDate } from "../../helpers/time";

interface Props extends RouteComponentProps {
    orderID: string
    unixPurchase: number
    orderDetails: OrderProps
    shippingDetails: ShippingInfoInterface
}

@observer
class TestApp extends React.Component<Props> {
    render() {
        const {orderID, unixPurchase} = this.props
        const {firstName, lastName, street, address, phone, info} = this.props.shippingDetails
        const {products, totalPaid} = this.props.orderDetails

        const convertedUnix = convertUnixToDate(unixPurchase)

        return (
            <Page>
                <Container style={{marginTop: "2em"}}>
                    <Header size="huge" as='h2'>#{orderID}</Header>
                    <Divider />
                    <Header size="huge" attached='top' as='h3' block color="blue">
                    Invoice from {convertedUnix}
                    </Header>
                    <Segment attached='bottom'>
                        <div style={{margin: "0em 1em", fontSize: "18px"}}>
                            <Shipping firstName={firstName} lastName={lastName} address={address} street={street} phone={phone} info={info} />
                        </div>
                       <OrderItem totalPaid={totalPaid} products={products}/>
                    </Segment>
                </Container>
            </Page>
        );
    }
}


export default withRouter(TestApp);