import React from 'react';
import { withStyles } from 'material-ui/styles'

let styles = {
    root: {
        minHeight: '50px',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 10px',
        fontSize: '14px',
        justifyContent: 'space-between'
    },
    username: {
        textAlign: 'left',
        color: '#2196F3',
        textTransform: 'uppercase',
    },
    textWrapper: {
        textAlign: 'right',
        color: '#ffffff',
        alignSelf: 'flex-end'
    },
    text: {
        backgroundColor: '#3F51B5',
        borderRadius: '14px',
        padding: '6px 8px',
        margin: '0 0 2px 0',
        textAlign: 'left',
        display: 'inline-block'
    }
}

const RenderListItem = ({ username, text, classes }) => {
    return (
        <div className={classes.root}>
            <strong className={classes.username}>{username}</strong>
            <div className={classes.textWrapper}>
                {text.split('\n').map((message, index) => {
                    return <div key={'messages' + index}><p className={classes.text}>{message}</p></div> 
                })}
            </div>
        </div>
    )
}

export default withStyles(styles)(RenderListItem);
