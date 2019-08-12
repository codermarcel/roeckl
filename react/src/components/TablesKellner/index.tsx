// import "./style.css"
// import store from "./store"
import { observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import multiStore from "../../stores/CartKellner";
import Page from "../Page"

const GridSuper = (props) => {
    return (
        <Comp perRow={3}/>
    )
}

export interface Props {
    perRow: number
    // totalTables: number
}


@observer
class Comp extends React.Component<Props> {
    render() {
        const perRow = this.props.perRow

        const pad = "2vh 2vw"

        return (
            <Page>
                <Grid columns="equal" style={{height: "100%", padding: pad}} textAlign="center" centered>
                    <Grid.Row style={{height: "50%"}}>
                        {Array.from({length: perRow}).fill(0).map((value, key) => (
                            <Item positive={multiStore.getStore(key+1).isActive} primary={!multiStore.getStore(key+1).isActive} key={key+1} id={key+1} />
                        ))}
        
                    </Grid.Row>
        
                    <Grid.Row style={{height: "50%"}}>
                        {Array.from({length: perRow}).fill(0).map((value, key) => (
                        <Item 
                            positive={multiStore.getStore(key+1+perRow).isActive}
                            primary={!multiStore.getStore(key+1+perRow).isActive}
                            key={key+1+perRow}
                            id={key+1+perRow}
                        />
                        ))}
                    </Grid.Row>
                </Grid>
            </Page>
        )
    }
}

interface ItemProps extends RouteComponentProps {
    primary: boolean
    positive: boolean
    id: any
}
const Item1 = (props) => {
    function onclick() {
        // store.setActive(props.id)
        props.history.push("/table/" +  props.id + "/categories")
    }
    const fontSize = "5vw"
    return (
        <Grid.Column stretched>
            <Button onClick={onclick} fluid primary={props.primary} positive={props.positive} style={{fontSize: fontSize}}>
                {props.id}
            </Button>
        </Grid.Column>
    )
}

const Item = withRouter(Item1)

export default withRouter(GridSuper)