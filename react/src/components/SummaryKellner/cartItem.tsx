import { observer } from 'mobx-react';
import React from 'react';
import { Button, Form, Grid, Item, Label } from 'semantic-ui-react';
import config from '../../stores/config';
import { ProductInterface } from '../../stores/products';

interface Props {
    product: ProductInterface
    wanted: number
    note: string
    increment: (cartID: string) => void
    decrement: (cartID: string) => void
    onNoteChange: (product: ProductInterface, newNote: any) => void
}

@observer
class CartItem extends React.Component<Props> {
    render() {
        const item = this.props.product
        let wantedQuantity = this.props.wanted ? this.props.wanted : 0
        let note = this.props.note
        const { avatar, id, name, price, category, description } = item
        const { increment, decrement, onNoteChange } = this.props

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
                                <h1>{wantedQuantity}</h1>
                                <Button onClick={() => increment(id)} positive size="huge">+</Button>
                                <Button onClick={() => decrement(id)} negative size="huge">-</Button>
                                </Grid.Column>

                                <Grid.Column textAlign="right" >
                                    <Label size="large" tag color="purple">
                                    {config.formatPrice(price * wantedQuantity)}
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column floated="left">
                                    <Form.TextArea onChange={(e, s) => onNoteChange(item, s.value)} value={note} placeholder='Additional notes for the cook' />
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