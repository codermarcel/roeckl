import { observer } from 'mobx-react';
import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import store from "../../stores/products";
import Page from "../Page";
import PaginationComponent from "../pagination";
import ProductCard from "../product";
import cartStore from '../../stores/cart';

@observer
class ProductsPage extends React.Component {

  componentDidMount() {
    store.getInitial()
  }

  render() {
    const products = store.products

    return (
      <Page>
          <Grid container doubling columns="4" stackable>

            <Grid.Row>
              <Grid.Column floated="left">
              <Form.Field value={store.selectedCategory} onChange={(e) => store.setCategory(e.target.value)} label={<h1>Category</h1>} control='select'>
                {store.categories.map((categoryItem) => (
                    <option key={categoryItem.category} value={categoryItem.category}>{categoryItem.category}</option>
                ))}
              </Form.Field>
              </Grid.Column>

              <Grid.Column floated="right" textAlign="left">
                <h1>Page</h1>
                <PaginationComponent/>
              </Grid.Column>
            </Grid.Row>

            {products.map((product) => (
              <Grid.Column key={product.id} stretched>
                <ProductCard
                  onClick={() => cartStore.addProduct(product)}
                  key={product.id} 
                  avatar={product.avatar} 
                  name={product.name} 
                  price={product.price} 
                  id={product.id} 
                  quantity={product.quantity}
                  description={product.description}
                  category={product.category}
                />
              </Grid.Column> 
            ))}

          </Grid>
      </Page>
    )
  }
}

export default ProductsPage;