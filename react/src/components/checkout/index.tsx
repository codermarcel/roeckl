import { observer } from "mobx-react";
import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";

import Page from "../Page";
import ConfirmPanel from "./confirmPanel";
import ShippingPanel from "./shippingPanel";
import cartStore from "../../stores/cart";
import checkoutStore from "../../stores/checkout";
import authStore from "../../stores/auth";
import messageStore from "../../stores/message";

@observer
class TestApp extends React.Component<RouteComponentProps> {
    render() {
        if (authStore.isGuest) {
            messageStore.setFail("Please login to continue with the checkout")
            return <Redirect to="/login" />
        }
        if (cartStore.uniqueProductsInCart < 1) {
            return <Redirect to="/products" />
        }

        const item = checkoutStore.isAtShipping ? <ShippingPanel/> : <ConfirmPanel/>
        
        return (
            <Page>
                {item}
            </Page>
        );
    }
}

export default withRouter(TestApp);