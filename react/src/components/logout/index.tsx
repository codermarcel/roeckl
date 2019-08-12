import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import store from "../../stores/auth";

// @observer
class LogoutComponent extends React.Component<RouteComponentProps> {
    render() {
        store.logout()
        return (
            <Redirect to=""/>
        );
    }
}

export default withRouter(LogoutComponent);