import { observer } from 'mobx-react';
import React from 'react';
import { Grid, Input, Item, Label } from 'semantic-ui-react';
import store from "../../stores/cart";
import config from '../../stores/config';

interface Props {
    cartID: string
    removeHandler: (cartID: string) => void
    setHandler: (cartID: string, wantedQuantity: number) => void
}

@observer
class CartItem extends React.Component<Props> {
    handleChangeWantedQuantity = (e: any, second) => {
        this.props.setHandler(this.props.cartID, second.value)
    }
    render() {
        const item = store.cartItems.get(this.props.cartID)
        if (item === undefined) {
            return null
        }

        const { avatar, id, name, price, quantity, category, description, wantedQuantity } = item
        const { removeHandler } = this.props

        return (
            <Item>
                <Item.Image src={avatar} />
                <Item.Content>
                    <Item.Header as='a'>{name} </Item.Header>
                    <Item.Meta>
                    <span>{category}</span>
                    </Item.Meta>
                    <Item.Description>
                    {description}
                    </Item.Description>
                    <Item.Extra>
                        <Grid columns="2" verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column floated="left">
                                    <Input type="number" name="quantity" min="1" max={quantity} value={wantedQuantity} onChange={this.handleChangeWantedQuantity}></Input>
                                </Grid.Column>

                                <Grid.Column textAlign="right" >
                                    <Label size="large" tag color="purple">
                                    {config.formatPrice(price * wantedQuantity)}
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column floated="left">
                                </Grid.Column>

                                <Grid.Column textAlign="right" >
                                    <Item as="a" onClick={(e) => removeHandler(id)} >Remove</Item>
                                </Grid.Column>
                            </Grid.Row>
 
                        </Grid>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }
}

export default CartItem