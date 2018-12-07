import React from 'react'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import PlayArrow from 'material-ui-icons/PlayArrow'
import { compose } from 'recompose'

import TypographyTheme from '../TypographyTheme'
import LoadingHOC from '../../HOCs/LoadingHOC'

const styles = {
    root: {
        border: '1px solid #e3e3e3',
        backgroundColor: '#ffffff',
        maxHeight: '90vh',
        overflow: 'hidden',
        margin: '5px 0'
    },
    list: {
        maxHeight: '80vh',
        overflow: 'auto',
        borderTop: '2px solid #e6e6e6'
    },
    heading: {
        color: '#2196F3'
    },
    pinky: {
        color: '#7986CB',
        fontSize: '1.2rem'
    }
}

const UserList = ({ users, classes, emitInvitation }) =>
    <div className={classes.root}>
        <h3 className={classes.heading}>Available users</h3>
        <List className={classes.list}>
            {users.map(({ id, username }) => 
                <ListItem 
                    key={id}
                    button
                    onClick={() => emitInvitation(id, username)}
                >
                    <ListItemText
                        disableTypography
                        primary={
                            <TypographyTheme value={username} />
                        } 
                        className={classes.listItem} 
                    />
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Comments">
                            <PlayArrow className={classes.pinky} />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>    
            )}
        </List>
    </div>

export default compose(
    LoadingHOC,
    withStyles(styles)
)(UserList)
