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
                        Register a new account
                    </Header>
                    <Form size='large' style={{textAlign: "left"}}>
                        <Segment stacked>

                        <Form.Input 
                            value={store.username}
                            error={store.usernameError}
                            onChange={(e, second) => store.setUsername(second.value)} 
                            label="Username" fluid icon="user"
                            iconPosition='left'
                            placeholder='Username'
                        />

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
                
                        <Button primary fluid size='large' onClick={(e) => store.register(this.props.history)}>
                            Register account
                        </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Already have an account? <Link to="/login">Login</Link>
                    </Message>
                    </Grid.Column>
                </Grid>
            </Page>
        );
    }
}

export default withRouter(TestApp);