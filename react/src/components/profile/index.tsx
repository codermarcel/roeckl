import { observer } from 'mobx-react';
import React from 'react';
import { Container, Divider, Header, Icon, Table } from 'semantic-ui-react';
import store from "../../stores/auth";
import Page from "../Page";

@observer
class  ProductsPage extends React.Component {
  render() {
    return (
      <Page>
          <Container text style={{marginTop: "2em"}}>
          <React.Fragment>
              <Divider horizontal>
                <Header as='h4'>
                  <Icon name='tag' />
                  Profile Info
                </Header>
              </Divider>

              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={2}>Username</Table.Cell>
                    <Table.Cell>{store.username}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Email</Table.Cell>
                    <Table.Cell>{store.email}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Role</Table.Cell>
                    <Table.Cell>{store.role}</Table.Cell>
                  </Table.Row>

                </Table.Body>
              </Table>
            </React.Fragment>

            </Container>
      </Page>
    )
  }
}

export default ProductsPage;