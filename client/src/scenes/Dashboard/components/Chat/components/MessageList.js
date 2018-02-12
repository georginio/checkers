import React from 'react'
import List, { ListItem } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'

import RenderListItem from './RenderListItem'

const styles = {
    root: {
        borderBottom: '3px solid #bfbfbf',
        maxHeight: '90%',
        overflowY: 'scroll'
    }
}

const MessageList = ({ classes, messages }) => {
    return (
        <List className={classes.root}>
            { messages.map(({ username, text }, index) => 
                <ListItem 
                    key={index} 
                    username={username} 
                    text={text} 
                    component={RenderListItem} 
                />)
            }
        </List>
    )
}

export default withStyles(styles)(MessageList)
