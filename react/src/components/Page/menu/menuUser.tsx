import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Menu } from 'semantic-ui-react';
import CartItem from '../itemCart';
import ProfileItem from '../itemProfile';


@observer
class MenuComp extends Component<RouteComponentProps> {
    changeActiveItem = (e: any, second: any) => {
        this.props.history.push("/" + second.name)
    }

    render() {
        let activeItem = this.props.location.pathname
        return (
            <Container>
                <ProfileItem/>
                <Menu.Item 
                    name='products' active={activeItem === '/products' || activeItem === '/'} 
                    onClick={this.changeActiveItem} 
                    style={{ padding: '1em 3em' }}
                />

                <Menu.Item 
                    name='orders' active={activeItem === '/orders'} 
                    onClick={this.changeActiveItem} 
                    style={{ padding: '1em 3em' }}
                />

                <Menu.Item position="right"
                    name='logout'
                    active={activeItem === '/logout'}
                    onClick={this.changeActiveItem} 
                    style={{ padding: '1em 3em' }}
                />

                <CartItem/>

            </Container>
        )
    }
}

export default withRouter(MenuComp)