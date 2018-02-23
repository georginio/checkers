import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

import Chat from '../../components/Chat/Chat'

const styles = {
    turn: {
        backgroundColor: '#ffffff',
        textAlign: 'center',
        marginBottom: '0',
        marginTop: '10px',
        padding: "25px 0",
        color: '#2196F3'
    }
}

class Board extends Component {

    render () {
        let { classes } = this.props
        
        return (
            <div className={classes.root}>
                <h1 className={classes.turn}>
                    Turn: {this.props.turn}
                </h1>
                <Chat private={true} />
            </div>
        );
    }

}

export default withStyles(styles)(Board)
