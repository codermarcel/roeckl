import { observer } from "mobx-react";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CartComponent from '../cart';
import CategoriesKellner from "../CategoriesKellner";
import CheckoutComponent from '../checkout';
import CreateProductComponent from "../createproduct";
import LoginComponent from '../login';
import LogoutComponent from '../logout';
import OrderComponent from '../order';
import OrderChef from "../OrderChef";
import OrderKellner from "../OrderKellner";
import OrderOwner from "../OrderOwner";
import OrdersComponent from '../orders';
import OrdersChef from "../OrdersChef";
import OrdersKellner from "../OrdersKellner";
import OrdersOwner from "../OrdersOwner";
import ProductDetailsPage from '../productdetails';
import ProductsPage from '../products';
import ProductsKellner from "../ProductsKellner";
import ProfileComponent from '../profile';
import RegisterComponent from '../register';
import SummaryKellner from "../SummaryKellner";
import TablesKellner from "../TablesKellner";
import ProtectedRoute from "./protectedRoute";
import ProductsOwner from "../ProductsOwner";
import ProductEditOwner from "../ProductEditOwner"


@observer
class RouterComponent extends React.Component {
    render() {
        return (
          <Router>
            <Switch>
              <Route path="/" exact component={ProductsPage} />
              <Route path="/products" exact component={ProductsPage} />
              <Route path="/productdetails" exact component={ProductDetailsPage} />
              <Route path="/login" exact component={LoginComponent} />
              <Route path="/logout" exact component={LogoutComponent} />
              <Route path="/register" exact component={RegisterComponent} />
              <Route path="/cart" exact component={CartComponent} />
      
              <ProtectedRoute path="/create-product" exact component={CreateProductComponent} />
              <ProtectedRoute path="/profile" exact component={ProfileComponent} />
              <ProtectedRoute path="/orders" exact component={OrdersComponent} />
              <ProtectedRoute path="/checkout" exact component={CheckoutComponent} />
              <ProtectedRoute path="/orders/:id" exact component={OrderComponent} />

              {/* //others */}
              <ProtectedRoute path="/tables" exact component={TablesKellner} />
              <ProtectedRoute path="/table/:tableid/categories" exact component={CategoriesKellner} />
              <ProtectedRoute path="/table/:tableid/categories/:category/products" exact component={ProductsKellner} />
              <ProtectedRoute path="/table/:tableid/summary" exact component={SummaryKellner} />

              <ProtectedRoute path="/orders-waiter" exact component={OrdersKellner} />
              <ProtectedRoute path="/orders-owner"  exact component={OrdersOwner} />
              <ProtectedRoute path="/orders-chef"  exact component={OrdersChef} />
              <ProtectedRoute path="/products-owner"  exact component={ProductsOwner} />
            
              <ProtectedRoute path="/orders-waiter/:id" exact component={OrderKellner} />
              <ProtectedRoute path="/orders-owner/:id" exact component={OrderOwner} />
              <ProtectedRoute path="/orders-chef/:id" exact component={OrderChef} />
              <ProtectedRoute path="/products-owner/:id" exact component={ProductEditOwner} />
            </Switch>
          </Router>
        );
    }
}

export default RouterComponent;