import React from 'react';
import { withStyles } from 'material-ui/styles'

import Check from '../Check/index';

const styles = {
    square: {
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
        position: 'relative'
    }
}

const Square = ({ classes, turn, active, row, column, onCheckClick, onSquareClick, suggested, king, side }) => {
    let check = null;
    let checkColor = null;

    if (turn === 'Player 1') {
        checkColor = '#F1F1FF';
    } else if (turn === 'Player 2') {
        checkColor = '#e35568'
    }

    let color = ((row + column) % 2) === 0 ? '#ffffff' : '#453c7a';
   
    let styles = {
        backgroundColor: suggested ? '#16A8C7' : color,
    };

    if (checkColor)
        check = ( 
            <Check 
                color={checkColor} 
                active={active} 
                king={king}
                side={side}
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
