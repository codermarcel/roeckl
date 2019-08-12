import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Menu, Segment } from 'semantic-ui-react';
import store from '../../stores/auth';
import GuestMenu from "./menu/menuGuest";
import OwnerMenu from "./menu/menuOwner";
import UserMenu from "./menu/menuUser";
import WaiterMenu from "./menu/menuWaiter";
import ChefMenu from "./menu/menuChef";

@observer
class MenuComp extends Component<RouteComponentProps> {
  render() {
    return (
      <Segment inverted>
        <Menu inverted pointing secondary stackable>
          <MenuSelection />
        </Menu>
      </Segment>
    )
  }
}


@observer
class MenuSelection extends Component {
  render() {
    if (store.isUser) {
      return <UserMenu/>
    }
    if (store.isWaiter) {
      return <WaiterMenu/>
    }
    if (store.isChef) {
      return <ChefMenu/>
    }
    if (store.isOwner) {
      return <OwnerMenu/>
    }

    return <GuestMenu/>
  }
}

export default withRouter(MenuComp)

