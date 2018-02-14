import React from 'react'
import { withStyles } from 'material-ui/styles'

import kingImg from './king.svg'

const styles = {
    check: {
        width: '70%',
        height: '70%',
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundSize: '80%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%'
    }
}

const Check = ({ classes, color, active, onClick, offset, king }) => {
    
    let style = {
        backgroundColor: color, 
        'boxShadow': !active ? 'none' : '0 0 10px 5px #16A8C7',
        backgroundImage: king ? 'url('+ kingImg +')' : '',
    }   

    return (
        <div 
            className={classes.check}
            style={style}
            onClick={(e) => onClick(e)} >
        </div>
    )
}

export default withStyles(styles)(Check)
