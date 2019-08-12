import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Container, Grid, Icon, Segment, Step } from 'semantic-ui-react';
import checkoutStore from "../../stores/checkout";
import ShippingContent from './shippingContent';

@observer
class TestApp extends React.Component<RouteComponentProps> {
    render() {
        return (
            <Container style={{marginTop: "2em"}}>
                <Step.Group attached='top'>
                    <Step active>
                        <Icon name='truck' />
                        <Step.Content>
                            <Step.Title>Shipping</Step.Title>
                            <Step.Description>Choose your shipping options</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step disabled>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title>Confirm Order</Step.Title>
                            <Step.Description>Verify order details</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>

                <ShippingContent/>

                <Segment attached>
                    <Grid columns="2">
                        <Grid.Column floated="left">
                        </Grid.Column>

                        <Grid.Column textAlign="right" >   
                            <Button disabled color="red" size="large" icon labelPosition='left'>
                                <Icon  name="arrow left"/>
                                Back
                            </Button>

                            <Button onClick={checkoutStore.nextStep} color="green" size="large" icon labelPosition='right'>
                                Next
                                <Icon  name="arrow right" />
                            </Button>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
        );
    }
}

export default withRouter(TestApp);