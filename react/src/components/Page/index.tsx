import { observer } from "mobx-react";
import React from 'react';
import { Container } from 'semantic-ui-react';
import MessageComponent from '../message';
import CustomFooter from "./footer";
import CustomMenu from "./menu";

@observer
class FixedMenuLayout extends React.Component {
  render() {
    return (
      <div>
        <CustomMenu/>
    
        <Container>
          <MessageComponent />
        </Container>
        
          {this.props.children}
        <CustomFooter/>
      </div>
    )
  }
}

export default FixedMenuLayout
