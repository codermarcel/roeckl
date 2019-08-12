import { observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import store from "../../stores/products";
import Page from "../Page"

@observer
class MyCompo extends React.Component<RouteComponentProps> {
    onClick = (category: any) => {
        const tableid = this.props.match.params["tableid"]
        store.setCategory(category)
        this.props.history.push("/table/" +  tableid +"/categories/" + category + "/products")
    }
    componentDidMount() {
        store.getCategories()
    }
    render() {
        
        let items: any = []
        const amount = store.categories.length
        store.categories.forEach((value, key) => {
            items.push(<Item key={value.category} onClick={this.onClick} primary positive={false} id={value.category} />)
        })
        let columns = 2
        if (amount >  10) {
            columns = 4
        }
        if (amount > 4) {
            columns = 3
        }

        return (
            <Comp columns={columns} totalItems={amount} items={items}/>
        )
    }
}

export interface Props {
    columns: number
    totalItems: number
    items: []
}


@observer
class Comp extends React.Component<Props> {
    render() {
        const rows = Math.ceil(this.props.totalItems/this.props.columns)
        const heigtPerRow = Math.floor(100/rows)
        const columns = this.props.columns
        const pad = "2vh 2vw"
        return (
            <Page>
                <Grid columns="equal" style={{height: "100%", padding: pad}} textAlign="center" stackable centered>
                    {Array.from({length: rows}).fill(0).map((value, rowKey) => (
                        <Grid.Row key={rowKey} style={{height: heigtPerRow + "%"}}>
                            {Array.from({length: columns}).fill(0).map((value, key) => (
                                this.props.items[ key + (rowKey * columns)]
                            ))}
                        </Grid.Row>
                    ))}
                </Grid>
            </Page>
        )
    }
}

interface ItemProps extends RouteComponentProps {
    primary: boolean
    positive: boolean
    id: any
    onClick: (id: string) => void
}

interface State {
    width: number
    height: number
}


@observer
class Item1 extends React.Component<ItemProps, State> {

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
      
    // componentDidMount() {
    //     this.updateWindowDimensions();
    //     window.addEventListener('resize', this.updateWindowDimensions);
    // }
    
    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.updateWindowDimensions);
    // }
    
    // updateWindowDimensions() {
    //     this.setState({ width: window.innerWidth, height: window.innerHeight });
    // }


    render() {
        const props = this.props
        const width = this.state.width
        let fontSize = "5em"
        if (width < 1400) {
            fontSize = "3em"
        }
        if (width < 700) {
            fontSize = "2em"
        }
        if (width < 400) {
            fontSize = "1em"
        }
        fontSize = "3vw"
        return (
            <Grid.Column stretched>
                <Button key={props.id} className="testingclass" onClick={(e) => props.onClick(props.id)} fluid primary={props.primary} positive={props.positive} style={{fontSize: fontSize}}>
                    {props.id}
                </Button>
            </Grid.Column>
        )
    }
}

const Item = withRouter(Item1)

export default withRouter(MyCompo)