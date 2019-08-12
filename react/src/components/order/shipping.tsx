import { observer } from 'mobx-react';
import React from 'react';

export interface ShippingInfoInterface {
    firstName: string
    lastName: string
    address: string
    street: string
    phone: string
    info: string
}

@observer
class Shipping extends React.Component<ShippingInfoInterface> {
  render() {
    const { firstName, lastName, address, street, phone, info } = this.props
    return (
        <div>
            <b>Shipping Info:</b> <br/><br/>
            {firstName} {lastName}<br/>
            {address}<br/>
            {street}<br/>
            <br/>
            <b>Tel:</b> {phone}<br/>
            <b>Additional Info for this order:</b> {info}
        </div>
    )
  }
}

export default Shipping;