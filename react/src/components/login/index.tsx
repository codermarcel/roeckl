import { observer } from "mobx-react";
import React from 'react';
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import store from "./store";
import Page from "../Page";


@observer
class TestApp extends React.Component<RouteComponentProps> {
    render() {
        return (
            <Page>
                <Grid textAlign='center' style={{ height: '100vh', marginTop: "5px"}} verticalAlign='top'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color="blue">
                        Login to your account
                    </Header>
                    <Form size='large' style={{textAlign: "left"}}>
                        <Segment stacked>
                        <Form.Input 
                            value={store.email}
                            error={store.emailError}
                            onChange={(e, second) => store.setEmail(second.value)} 
                            label="Email" fluid icon="mail"
                            iconPosition='left'
                            placeholder='E-mail address'
                        />

                        <Form.Input
                            value={store.password}
                            error={store.passwordError}
                            onChange={(e, second) => store.setPassword(second.value)}
                            labelPosition="left"
                            label="Password"
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                        />
                
                        <Button primary fluid size='large' onClick={(e) => store.login(this.props.history)}>
                            Login
                        </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Don't have an account?  <Link to="/register">Register</Link>
                    </Message>
                    </Grid.Column>
                </Grid>
            </Page>
        );
    }
}

export default withRouter(TestApp);
