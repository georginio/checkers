import React from 'react'
import { withStyles } from 'material-ui/styles'

import Chat from '../Chat'
import { defineSideColor } from '../../utils/common'

const styles = {
    turn: {
        backgroundColor: '#ffffff',
        marginBottom: '0',
        padding: "4px 14px",
        color: '#4c4545',
        display: 'flex',
        alignItems: 'center'
    },
    badge: {
        border: '1px solid #e3e3e3',
        backgroundColor: 'rgb(69, 60, 122)',
        borderRadius: '3px',
        display: 'inline-block',
        padding: '8px',
        marginLeft: '6px',
    },
    circlce: {
        width: '18px',
        height: '18px',
        borderRadius: '50%'
    }
}

const Sidebar = ({ classes, turn }) => {
    const badgeStyles = {
        'background-color': defineSideColor(turn)
    } 

    return (
        <div className={classes.root}>
            <div className={classes.turn}>
                <h3>Turn:</h3>
                <span className={classes.badge}>
                    <div className={classes.circlce} style={badgeStyles}></div>
                </span> 
            </div>
            <Chat private={true} />
        </div>
    );
}

export default withStyles(styles)(Sidebar)
