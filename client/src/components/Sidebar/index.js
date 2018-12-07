import React from 'react'
import { withStyles } from 'material-ui/styles'

import Chat from '../Chat'

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

const Sidebar = ({ classes, turn }) => {
    return (
        <div className={classes.root}>
            <h1 className={classes.turn}>
                Turn: {turn}
            </h1>
            <Chat private={true} />
        </div>
    );
}

export default withStyles(styles)(Sidebar)
