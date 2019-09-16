import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Divider, Header, Segment, Button } from "semantic-ui-react";
import Page from "../Page";
import OrderItem, { OrderProps } from "./order";
import { convertUnixToDate } from "../../helpers/time";
import axiosInstane from "../../stores/axios";
import msgStore from '../../stores/message'

interface Props extends RouteComponentProps {
    userid: string
    orderID: string
    unixPurchase: number
    orderDetails: OrderProps
    cancelFunc: (orderid: string, history) => void
    markPaidFunc: (orderid: string, histor) => void
}

@observer
class TestApp extends React.Component<Props> {
    state = {username: "n/a", email: "n/a"}

    componentDidMount() {
        const data = {user_id: this.props.userid}
        axiosInstane.post("/owner/user/details", data)
        .then((response) => {
            if (response.data.success) {
                msgStore.setLog("Success! User details loaded for user with id: " + this.props.userid)
                console.log("logging response data", response.data.data)
                this.setState({username: response.data.data.username, email: response.data.data.email})
            }else {
                msgStore.setFail(response.data.message)
            }
        })
        .catch((error) => {
            msgStore.setFail("Server Error: something went wrong")
            console.log(error)
        })
    }

    render() {
        const history = this.props.history
        const {orderID, unixPurchase, cancelFunc, markPaidFunc, userid} = this.props
        const {products, totalPaid} = this.props.orderDetails

        const convertedUnix = convertUnixToDate(unixPurchase)

        const username = this.state.username
        const email = this.state.email

        return (
            <Page>
                <Container style={{marginTop: "2em"}}>
                    <Header size="huge" as='h2'>Ordered By# {username} | {email}</Header>
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
                        <Button onClick={(e) => markPaidFunc(orderID, history)} size="huge" positive style={{margin: "0em 1em"}}>Mark Order as Paid</Button>
                    </Button.Group>
                </Container>
            </Page>
        );
    }
}


export default withRouter(TestApp);