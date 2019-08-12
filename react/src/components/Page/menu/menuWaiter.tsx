import { observer } from 'mobx-react';
import React, { Component } from 'react';
// import { createBrowserHistory } from 'history';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Menu } from 'semantic-ui-react';
import LogoutItem from "../itemLogout"
import ProfileItem from '../itemProfile';

@observer
class MenuComp extends Component<RouteComponentProps> {

    changeActiveItem = (e: any, second: any) => {
        this.props.history.push("/" + second.name)
    }

    change = (name) => {
        this.props.history.push(name)
    }

    render() {
        let activeItem = this.props.location.pathname
        return (
            <Container>
                <ProfileItem/>
                <Menu.Item 
                    name='tables' active={activeItem === '/tables' || activeItem === '/tables'} 
                    onClick={this.changeActiveItem} 
                    style={{ padding: '1em 3em' }}
                />
                <Menu.Item 
                    name='orders' active={activeItem === '/orders-waiter' || activeItem === '/orders-waiter'} 
                    onClick={(e) => this.change("/orders-waiter")} 
                    style={{ padding: '1em 3em' }}
                />
                <LogoutItem position="right"/>
            </Container>
        )
    }
}

export default withRouter(MenuComp)