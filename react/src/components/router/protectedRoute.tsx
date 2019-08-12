import React from "react";
import { Redirect, Route, RouteComponentProps, withRouter } from "react-router-dom";
import authStore from "../../stores/auth";
import msgStore from "../../stores/message";
import { observer } from "mobx-react";

interface Props extends RouteComponentProps {
    path: string
    exact: boolean
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

@observer
class ProtectedRoute extends React.Component<Props> {
    render() {
        if (authStore.isGuest) {
            msgStore.setFail("Please login to continue")
            return <Redirect to="/login"/>
        }
        return (
            <Route path={this.props.path} exact={this.props.exact} component={this.props.component} />
        );
    }
}

export default withRouter(ProtectedRoute);