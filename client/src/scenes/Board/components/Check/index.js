import React from 'react';
import kingImg from './king.svg';

import './index.css';

const Check = ({ color, active, onClick, offset, king }) => {
    
    let style = {
        backgroundColor: color, 
        'boxShadow': !active ? 'none' : '0 0 10px 5px #16A8C7',
        backgroundImage: king ? 'url('+ kingImg +')' : '',
    }   

    return (
        <div 
            className="check"
            style={style}
            onClick={(e) => onClick(e)} >
        </div>
    )
};

export default Check;
