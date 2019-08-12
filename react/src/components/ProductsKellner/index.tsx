import { observer } from "mobx-react";
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Header, Item } from 'semantic-ui-react';
import multiStore from "../../stores/CartKellner";
import config from '../../stores/config';
import productStore, { ProductInterface } from '../../stores/products';
import Page from "../Page";
import ButtonPanel from './buttonPanel';
import CartItem from './cartItem';


@observer
class TestApp extends React.Component<RouteComponentProps> {
    render() {

        const tableid = this.props.match.params["tableid"]
        // const category = this.props.match.params["category"]
        let store = multiStore.getStore(tableid)

        const products = productStore.products
        if (products.length < 1 ) {
            return (
                <Page>
                    <Container>
                    <h1>No products available</h1>
                    </Container>
                </Page>
            )
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