import React from 'react'
import List from 'material-ui/List'
import { withStyles } from 'material-ui/styles'

const styles = {
    root: {
        borderBottom: '2px solid #e3e3e3'
    }
}

let messageMock = [
    {
        username: 'Lemmy',
        text: 'That\'s a way I like it baby'
    },
    {
        username: 'Rob',
        text: 'Breaking the law'
    },
    {
        username: 'James',
        text: 'Searching!!! Seek & destroy'
    }
]

const MessageList = ({ classes }) => {
    return (
        <List className={classes.root}>
            
        </List>
    );
}

export default withStyles(styles)(MessageList)
