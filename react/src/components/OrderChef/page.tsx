import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Divider, Header, Segment, Button } from "semantic-ui-react";
import Page from "../Page";
import OrderItem, { OrderProps } from "./order";
import { convertUnixToDate } from "../../helpers/time";

interface MyProps extends RouteComponentProps {
    orderID: string
    unixPurchase: number
    orderDetails: OrderProps
    cancelFunc: (orderid: string, history) => void
}

@observer
class TestApp extends React.Component<MyProps> {
    render() {
        const history = this.props.history
        const {orderID, unixPurchase, cancelFunc} = this.props
        const {products, totalPaid} = this.props.orderDetails

        const convertedUnix = convertUnixToDate(unixPurchase)

        return (
            <Page>
                <Container style={{marginTop: "2em"}}>
                    <Header size="huge" as='h2'>#{orderID}</Header>
                    <Divider />
                    <Header size="huge" attached='top' as='h3' block color="blue">
                    Ordered {convertedUnix}
                    </Header>
                    <Segment attached='bottom'>
                        <div style={{margin: "0em 1em", fontSize: "18px"}}>
                        </div>
                       <OrderItem totalPaid={totalPaid} products={products}/>
                    </Segment>
                    <Button.Group>
                        <Button onClick={(e) => cancelFunc(orderID, history)} size="huge" negative style={{margin: "0em 0em"}}>Cancel Order</Button>
                    </Button.Group>
                </Container>
            </Page>
        );
    }
}


export default withRouter(TestApp);