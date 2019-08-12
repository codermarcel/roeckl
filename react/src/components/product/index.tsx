import React from 'react';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import config from '../../stores/config';
import { ProductInterface } from "../../stores/products";

interface ProductCardProps extends ProductInterface {
  avatar: string
  onClick: () => void
}

const ProductCard = (props: ProductCardProps) => (
  <Card>
    <Image style={{maxHeight: "200px", maxWidth: "350px", minHeight: "80px", minWidth: "50px"}} src={props.avatar} />
    <Card.Content>
      <Card.Header>
      {props.name} 
      </Card.Header>
      <Card.Meta> 
      </Card.Meta>
      <Card.Description>
        {props.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra style={{marginTop: "5px"}}>
      <Label size="medium" tag color="purple">{config.formatPrice(props.price)}</Label>
    </Card.Content>
    <Card.Content extra>
      <Button onClick={props.onClick} fluid primary> <Icon name="cart"/> Add to cart </Button>
    </Card.Content>
  </Card>
)

export default ProductCard
