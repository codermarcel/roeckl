import { observer } from "mobx-react";
import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Header, Item } from 'semantic-ui-react';
import store, { CartItemInterface } from "../../stores/cart";
import config from '../../stores/config';
import Page from "../Page";
import CartItem from './cartItem';
import PriceItem from './priceItem';

@observer
class TestApp extends React.Component<RouteComponentProps> {
    render() {
        if (store.uniqueProductsInCart < 1) {
            return <Redirect to="products"/>
        }
        return (
            <Page>
                <Header as='h1' content={"Total: " + config.formatPrice(store.totalCost)} textAlign='center' />
                <Container>
                    <Item.Group divided >
                        
                        {Array.from(store.cartItems.values()).map((value: CartItemInterface, key: any) => (
                            <CartItem key={value.id} cartID={value.id} setHandler={store.changeWantedQuantity} removeHandler={store.removeProduct}/>
                        ))}

                        <PriceItem/>

                    </Item.Group>
                </Container>

            </Page>
        );
    }
}

export default withRouter(TestApp);