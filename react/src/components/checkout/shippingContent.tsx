import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Input, Segment } from 'semantic-ui-react';
import store from "../../stores/checkout";

@observer
class ShippingContent extends React.Component<RouteComponentProps> {
    render() {
        return (
            <div>
                <Segment attached style={{padding: "2em"}} >
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field
                                error={store.firstNameError}
                                value={store.firstName}
                                onChange={(e, second) => store.setFirstName(second.value)}
                                id='form-input-control-first-name'
                                control={Input}
                                label='First name'
                                placeholder='First name'
                            />
                            <Form.Field
                                error={store.lastNameError}
                                value={store.lastName}
                                onChange={(e, second) => store.setLastName(second.value)}
                                id='form-input-control-last-name'
                                control={Input}
                                label='Last name'
                                placeholder='Last name'
                            />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Field
                                error={store.addressError}
                                value={store.address}
                                onChange={(e, second) => store.setAddress(second.value)}
                                id='form-textarea-control-opinion'
                                control={Input}
                                label='Address'
                                placeholder='Address'
                            />
                            <Form.Field
                                error={store.streetError}
                                value={store.street}
                                onChange={(e, second) => store.setStreet(second.value)}
                                id='form-textarea-control-opinion'
                                control={Input}
                                label='Street'
                                placeholder='Street'
                            />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Field
                                error={store.phoneError}
                                value={store.phone}
                                onChange={(e, second) => store.setPhone(second.value)}
                                id='form-textarea-control-opinion'
                                control={Input}
                                label='Phone'
                                placeholder='Phone'
                            />
                            <Form.Field
                                error={store.infoError}
                                value={store.info}
                                onChange={(e, second) => store.setInfo(second.value)}
                                id='form-textarea-control-opinion'
                                control={Input}
                                label='Additional info'
                                placeholder='Additional info'
                            />
                        </Form.Group>
                    </Form>
                </Segment>
            </div>
        );
    }
}


export default withRouter(ShippingContent);