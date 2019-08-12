import { observer } from 'mobx-react';
import React from 'react';
import { Button, Checkbox, Container, Form, Message } from 'semantic-ui-react';
import store from "./createStore";
import Dropzone from "./dropzone";

@observer
class CreateForm extends React.Component {
    render() {
        return (
            <Container style={{margin: "2em 2em"}}>
                <Message
                    attached
                    header='Create Product'
                    content='Fill out the form below to create a new product'
                />
                <Form className='attached fluid segment' style={{padding: "1em 2em"}}>
                    <Form.Group widths='equal'>
                        <Form.Input label='Product Name' type='text' error={store.nameError} value={store.name} onChange={(e, second) => store.setName(second.value)} />
                        <Form.Input label='Product Category' type='text' error={store.categoryError} value={store.category} onChange={(e, second) => store.setCategory(second.value)} />
                   </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input fluid error={store.priceError} label={'Price in CENTS'} min={100} value={store.price} onChange={(e, second) => store.setPrice(second.value)} type='number' />
                        <Form.Input fluid error={store.quantityError} label="Quantity" value={store.quantity}  min={1} onChange={(e, second) => store.setQuantity(second.value)} type='number' />
                    </Form.Group>
                    <Form.TextArea label='Description' error={store.descriptionError} value={store.description} onChange={(e, second) => store.setDescription(String(second.value))} />
                    <Form.Field>
                        <label>Avatar</label>
                        <Dropzone onChange={store.setAvatarFile}/>
                    </Form.Field>
                    <Form.Field>
                        <Checkbox checked={store.enabled} onChange={(e, second) => store.setEnabled(second.checked)} label='Enable Product' />
                    </Form.Field>
                    <Form.Field>
                        <Button onClick={store.createProduct} size="large" color='blue'>Submit</Button>
                    </Form.Field>
                </Form>
            </Container>
        );
    }
}

export default CreateForm