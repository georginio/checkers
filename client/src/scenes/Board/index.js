import React, { Component } from 'react';
import Square from './components/Square/index';

import './index.css';

class Board extends Component {

    render () {
        const squares = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                let props = this.props.squares[i][j];
                let key= null;
                let suggested = false;
                if (!props) return null;
                
                if (this.props.isSuggested(props.row, props.column))
                    suggested = true;
                    
                key = 'i' + i + 'j' + j;
                
                let square = (<Square 
                    {...props}
                    key={key}
                    suggested={suggested}
                    onCheckClick={this.props.onCheckClick}
                    onSquareClick={this.props.onSquareClick}
                />); 
                
                squares.push(square);
            }
        }

        return (
            <div className="board">
                {squares}
            </div>
        );
    }

}

export default Board;

