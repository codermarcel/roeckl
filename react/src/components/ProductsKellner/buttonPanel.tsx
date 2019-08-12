import { observer } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Item } from "semantic-ui-react";

interface Props extends RouteComponentProps{
    onCancel: () => void
}

@observer
class SummaryPrice extends React.Component<Props> {
    tableId = this.props.match.params["tableid"]

    more = () => {
        this.props.history.push("/table/" +  this.tableId + "/categories")
    }
    
    summary = () => {
        this.props.history.push("/table/" +  this.tableId + "/summary")
    }

    cancel = () => {
        this.props.onCancel()
        this.props.history.push("/tables")
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
                        <Button onClick={this.summary} content="Summary" positive icon="cart arrow down" labelPosition='left' floated="right" size="huge"></Button>
                        <Button onClick={this.cancel} content="Cancel" negative icon="stop" labelPosition='left' floated="right" size="huge" ></Button>
                        <Button onClick={this.more} primary content="More" icon="angle right" labelPosition='left' floated="right" size="huge"></Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }
}

export default withRouter(SummaryPrice)