import React from 'react'
import List, { ListItem } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'

import RenderListItem from './RenderListItem'

const styles = {
    root: {
        borderBottom: '3px solid #bfbfbf'
    }
}

let messageMock = [
    {
        username: 'Lemmy',
        text: 'That\'s a way I like it baby, I don\'t wanna live for ever, and don\'t forget a joker'
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
            { messageMock.map(({ username, text }, index) => <ListItem key={index} username={username} text={text} component={RenderListItem} /> )}
        </List>
    );
}

export default withStyles(styles)(MessageList)
