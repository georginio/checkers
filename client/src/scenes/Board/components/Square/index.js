import React from 'react';
import { withStyles } from 'material-ui/styles'

import Check from '../Check/index';

const styles = {
    square: {
        height: '100%',
        width: '100%',
        backgroundColor: 'brown',
        position: 'relative'
    }
}

const Square = ({ classes, turn, active, row, column, onCheckClick, onSquareClick, suggested, king }) => {
    let check = null;
    let checkColor = null;

    if (turn === 'Player 1') {
        checkColor = '#F1F1FF';
    } else if (turn === 'Player 2') {
        checkColor = '#e4a6ae'
    }

    let color = ((row + column) % 2) === 0 ? '#B93848' : '#232621';
   
    let styles = {
        backgroundColor: suggested ? 'blue' : color,
    };

    if (checkColor)
        check = ( 
            <Check 
                color={checkColor} 
                active={active} 
                king={king}
                onClick={(e) => onCheckClick(e, row, column) } 
            /> 
        );

return (
        <div 
            className={classes.square}
            style={styles}
            onClick={ (e) => onSquareClick(e, row, column, turn) }
        >
            {check}
        </div>
    )
};

export default withStyles(styles)(Square)
