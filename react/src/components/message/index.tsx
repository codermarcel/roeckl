import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'
import store from "../../stores/message"
import { observer } from 'mobx-react';

@observer
class MessageComponent extends Component {
  render() {
    return (
        <Message
          size="big"
          info={store.isInfo}
          positive={store.isSuccess}
          negative={store.isFail}
          hidden={!store.isVisible}
          onDismiss={store.dismiss}
          header={store.isSuccess ? "Success!" : store.isFail ? "Error" : "Info"}
          content={store.message}
          style={{margin: "1em 0em"}}
        />
    )
  }
}

export default MessageComponent
