import { observer } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Item } from "semantic-ui-react";

@observer
class SummaryPrice extends React.Component<RouteComponentProps> {
    handleClick = () => {
        this.props.history.push("/checkout")
    }
    render() {
        return (
            <Item>
                <Item.Content>
                    <Item.Header as='a'></Item.Header>
                    <Item.Meta>
                    </Item.Meta>
                    <Item.Description>
                    </Item.Description>
                    <Item.Extra>
                        <Button primary content="Checkout" icon="credit card" labelPosition='left' floated="right" size="huge" onClick={this.handleClick}>
                        </Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }
}

export default withRouter(SummaryPrice)