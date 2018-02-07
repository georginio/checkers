import React from 'react';

import './index.css';

import Check from '../Check/index';

const Square = ({ turn, active, row, column, onCheckClick, onSquareClick, suggested, king }) => {
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
            className="square"
            style={styles}
            onClick={ (e) => onSquareClick(e, row, column, turn) }
        >
            {check}
        </div>
    )
};

export default Square;
