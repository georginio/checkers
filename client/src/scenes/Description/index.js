import React, { Component } from 'react'

import Chat from '../../components/Chat/Chat'

class Board extends Component {

    render () {
        return (
            <div>
                turn: {this.props.turn}
                <Chat private={true} />
            </div>
        );
    }

}

export default Board;