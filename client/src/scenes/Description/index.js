import React, { Component } from 'react';

class Board extends Component {

    render () {
        return (
            <div>
                turn: {this.props.turn}
            </div>
        );
    }

}

export default Board;