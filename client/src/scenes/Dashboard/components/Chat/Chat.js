import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

import MessageList from './components/MessageList'
import MessageForm from './components/MessageForm'

const styles = {
    root: {
        height: '90vh',
        backgroundColor: '#ffffff',
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'column'
    }
}

class Chat extends Component {

    render() {
        let { classes } = this.props

        return (
            <div className={classes.root}>
                <MessageList />
                <MessageForm />
            </div>
        );
    }
}

export default withStyles(styles)(Chat)
