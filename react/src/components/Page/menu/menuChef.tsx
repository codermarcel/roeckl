import React, { Component } from 'react'
import { Menu, Container } from 'semantic-ui-react'
import { observer } from 'mobx-react';

import { withRouter, RouteComponentProps } from "react-router-dom"
import LogoutItem from '../itemLogout';
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
                    name="orders" active={activeItem === '/orders-chef' || activeItem === '/orders-chef'} 
                    onClick={(e) => this.change("/orders-chef")} 
                    style={{ padding: '1em 3em' }}
                />

                <LogoutItem position="right"/>
            </Container>
        )
    }
}

export default withRouter(MenuComp)