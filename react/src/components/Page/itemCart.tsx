import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, Label, Menu } from 'semantic-ui-react';
import cartStore from "../../stores/cart";

interface Props extends RouteComponentProps {
    position?: "left" | "right"
}

@observer
class MenuComp extends Component<Props> {
    changeActiveItem = (e: any, second: any) => {
        this.props.history.push("/" + second.name)
    }

    render() {
        let activeItem = this.props.location.pathname

        const item =
            <Menu.Item position={this.props.position} name="cart" active={activeItem === '/cart'} onClick={this.changeActiveItem}>  
                <Icon name="cart"/>
                <Label floating color='teal'>{cartStore.uniqueProductsInCart}</Label> 
            </Menu.Item>;

        return cartStore.uniqueProductsInCart > 0 ? item : null
    }
}

export default withRouter(MenuComp)
