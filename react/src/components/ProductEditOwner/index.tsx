import { observer } from 'mobx-react';
import React from 'react';
import { Button, Checkbox, Container, Form, Message } from 'semantic-ui-react';
import store from "./editStore";
import Dropzone from "./dropzone";
import Page from "../Page"
import { RouteComponentProps, withRouter } from 'react-router';
import productsStore from "../ProductsOwner/store"

@observer
class EditForm extends React.Component<RouteComponentProps> {
    render() {
        return (
            <Page>
                <Container style={{margin: "2em 2em"}}>
                    <Message
                        attached
                        header='Edit Product'
                        content='Edit your product below'
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
                            <Button onClick={store.updateProduct} size="large" color='blue'>Update Product</Button>
                            <Button onClick={(e) => store.deleteProduct(this.props.history)} size="large" negative>Delete Product</Button>
                        </Form.Field>
                    </Form>
                </Container>
            </Page>
        );
    }
}


@observer
class InitialEditForm extends React.Component<RouteComponentProps> {
    render() {
        const productID = this.props.match.params["id"]
        if (productID === undefined) {
            return (
                <Page>
                    <Container>
                        <h1>Product ID not found</h1>
                    </Container>
                </Page>
            )
        }

        const product = productsStore.findProduct(productID)
        if (product === undefined) {
            return (
                <Page>
                    <Container>
                        <h1>Could not find Product</h1>
                    </Container>
                </Page>
            )
        }

        store.setID(product.id)
        store.setName(product.name)
        store.setDescription(product.description)
        store.setPrice(product.price)
        store.setQuantity(product.quantity)
        store.setEnabled(!product.disabled)
        store.setCategory(product.category)
        //no need to set the avatar here, empty avatar means no change

        return (
            <EditForm {...this.props}/>
        );
    }
}


export default InitialEditForm