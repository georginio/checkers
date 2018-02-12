import React from 'react';
import { withStyles } from 'material-ui/styles'

let styles = {
    root: {
        minHeight: '50px',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        fontSize: '14px'
    },
    username: {
        textAlign: 'left',
        color: '#2196F3',
        textTransform: 'uppercase'
    },
    textWrapper: {
        textAlign: 'right',
        color: '#ffffff',
    },
    text: {
        backgroundColor: '#3F51B5',
        borderRadius: '20px',
        padding: '10px'
    }
}

const RenderListItem = ({ username, text, classes }) => {
    return (
        <div className={classes.root}>
            <strong className={classes.username}>{username}</strong>
            <div className={classes.textWrapper}>
                <span className={classes.text}>{text}</span>   
            </div>
        </div>
    );
}

export default withStyles(styles)(RenderListItem);
