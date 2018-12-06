import React from 'react'
import Square from '../../components/Square'
import { withStyles } from 'material-ui/styles'

const styles = { 
    board: {
        height: '720px',
        width: '720px',
        backgroundColor: 'aqua',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 12.5%)',
        gridTemplateRows: 'repeat(8, 12.5%)',
        justifySelf: 'center',
        alignSelf: 'center',
        '@media all and (max-width: 1120px), all and (max-height: 800px)': {
            height: '640px',
            width: '640px'
        },
        '@media all and (max-width: 970px)': {
            height: '560px',
            width: '560px'
        },
        '@media all and (max-width: 850px)': {
            height: '480px',
            width: '480px'
        }
    }
}

const Board = ({ classes, squares, isSuggested, onCheckClick, onSquareClick, side }) => {

    let rotationStyle = {
        transform: side === 'Player 1' ? "rotate(180deg)" : "none"
    }

    const renderSquares = []

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            let props = squares[i][j]
            let key= null
            let suggested = false
            if (!props) return null
            
            if (isSuggested(props.row, props.column))
                suggested = true
                
            key = 'i' + i + 'j' + j
            
            let square = (<Square 
                {...props}
                key={key}
                suggested={suggested}
                side={side}
                onCheckClick={onCheckClick}
                onSquareClick={onSquareClick}
            />); 
            
            renderSquares.push(square)
        }
    }

    return (
        <div 
            className={classes.board}
            style={rotationStyle}
        >
            {renderSquares}
        </div>
    )

}

export default withStyles(styles)(Board)

