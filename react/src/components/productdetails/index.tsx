import axios from "axios";
import React from 'react';

class TestApp extends React.Component {
    state = {products: [], tried: false}

    getProducts() {
        axios.get('http://localhost:3000/products')
        .then((response) => {
            this.setState({products: response.data.products, tried: true})
        })
        .catch((error) => {
            this.setState({tried: true})
        })
    }
    
    render() {
        return (
            <div className="App">
                
                Product Details...
            </div>
        );
    }
}

export default TestApp;