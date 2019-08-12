import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { withRouter, RouteComponentProps } from "react-router-dom"

class LogoutItem extends Component<RouteComponentProps> {
    changeActiveItem = (e: any, second: any) => {
        this.props.history.push("/" + second.name)
    }

    render() {
        let activeItem = this.props.location.pathname
        return (
            <Menu.Item
                name='profile'
                active={activeItem === '/profile'}
                onClick={this.changeActiveItem} 
                style={{ padding: '1em 3em' }}
            />
        )
    }
}

export default withRouter(LogoutItem)