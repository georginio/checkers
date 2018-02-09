import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

const styles = {
    root: {
        height: '90vh',
        backgroundColor: '#ffffff',
        margin: '30px 0'
    }
}

class Chat extends Component {

    render() {
        let { classes } = this.props

        return (
            <div className={classes.root}>
                
            </div>
        );
    }
}

export default withStyles(styles)(Chat)
