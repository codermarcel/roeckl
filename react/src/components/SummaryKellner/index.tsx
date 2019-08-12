import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Header, Item } from 'semantic-ui-react';
import multiStore from "../../stores/CartKellner";
import config from '../../stores/config';
import { ProductInterface } from "../../stores/products";
import Page from "../Page";
import ButtonPanel from './buttonPanel';
import CartItem from './cartItem';

@observer
class TestApp extends React.Component<RouteComponentProps> {
    tableid = this.props.match.params["tableid"]

    render() {
        const store = multiStore.getStore(this.tableid)
        const products = store.cartItemArray
        if (products.length < 1) {
            return <Page><Container><h1>No Products in cart</h1></Container></Page>
        }
        return (
            <Page>
                <Header as='h1' content={"Total: " + config.formatPrice(store.totalCost)} textAlign='center' />
                <Container>
                    <Item.Group divided >
                        
                        {products.map((value: ProductInterface, key: any) => (
                             <CartItem key={value.id} note={store.getNote(value.id)} onNoteChange={store.setNote} increment={() => store.increment(value)} decrement={() => store.decrement(value)} product={value} wanted={store.getWanted(value.id)}/>
                        ))}

                        <ButtonPanel onCancel={store.cancel}/>

                    </Item.Group>
                </Container>

            </Page>
        );
    }
}

export default withRouter(TestApp);