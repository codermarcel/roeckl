import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { withRouter, RouteComponentProps } from "react-router-dom"

interface Props extends RouteComponentProps{
    position?: 'left' | 'right'
}

class LogoutItem extends Component<Props> {
    changeActiveItem = (e: any, second: any) => {
        this.props.history.push("/" + second.name)
    }

    render() {
        let activeItem = this.props.location.pathname
        return (
            <Menu.Item position={this.props.position}
                name='logout'
                active={activeItem === '/logout'}
                onClick={this.changeActiveItem} 
                style={{ padding: '1em 3em' }}
            />
        )
    }
}

export default withRouter(LogoutItem)