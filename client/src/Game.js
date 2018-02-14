import React, { Component } from 'react';
import { connect } from 'react-redux'

import Board from './scenes/Board';
import Description from './scenes/Description';

import './Game.css';

import { switchTurn } from './actions/playActions'

import {
    subscribeToMove,
    emitMove,
    emitSwitchTurn,
    subscribeToSwitchTurn
} from './socket'

const PLAYER_1 = 'Player 1';
const PLAYER_2 = 'Player 2';

class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            squares: [
                [
                    null, 
                    { player: PLAYER_1, king: false, active: false, x: 135, y: 45 }, 
                    null, 
                    { player: PLAYER_1, king: false, active: false, x: 315, y: 45 }, 
                    null, 
                    { player: PLAYER_1, king: false, active: false, x: 495, y: 45 }, 
                    null, 
                    { player: PLAYER_1, king: false, active: false, x: 675, y: 45 }
                ], 
                [
                    { player: PLAYER_1, king: false, active: false, x: 45, y: 135 }, 
                    null,
                    { player: PLAYER_1, king: false, active: false, x: 225, y: 135 }, 
                    null,
                    { player: PLAYER_1, king: false, active: false, x: 405, y: 135 }, 
                    null,
                    { player: PLAYER_1, king: false, active: false, x: 585, y: 135 }, 
                    null
                ], 
                [
                    null, 
                    { player: PLAYER_1, king: false, active: false, x: 135, y: 225 }, 
                    null,
                    { player: PLAYER_1, king: false, active: false, x: 315, y: 225 }, 
                    null,
                    { player: PLAYER_1, king: false, active: false, x: 495, y: 225 }, 
                    null, 
                    { player: PLAYER_1, king: false, active: false, x: 675, y: 225 }
                ], 
                [
                    { x: 45, y: 315 }, 
                    null,
                    { x: 225, y: 315 }, 
                    null,
                    { x: 405, y: 315 }, 
                    null, 
                    { x: 585, y: 315 }, 
                    null,
                ], 
                [
                    null, 
                    { x: 135, y: 405 }, 
                    null,
                    { x: 315, y: 405 }, 
                    null, 
                    { x: 495, y: 405 }, 
                    null,
                    { x: 675, y: 405 }
                ], 
                [
                    { player: PLAYER_2, king: false, active: false, x: 45, y: 495 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 225, y: 495 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 405, y: 495 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 585, y: 495 }, 
                    null
                ],  
                [
                    null,  
                    { player: PLAYER_2, king: false, active: false, x: 135, y: 585 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 315, y: 585 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 495, y: 585 }, 
                    null,  
                    { player: PLAYER_2, king: false, active: false, x: 675, y: 585 }
                ],
                [
                    { player: PLAYER_2, king: false, active: false, x: 45, y: 675 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 225, y: 675 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 405, y: 675 }, 
                    null, 
                    { player: PLAYER_2, king: false, active: false, x: 585, y: 675 }, 
                    null
                ]  
            ],
            turn: PLAYER_1,
            suggestedSquares: []
        };
        
        this.activeColumn = null;
        this.activeRow = null;

        this.mustMove = false;
        this.bannedDirection = null;

        this.killTarget = [];
        this.killBy = null;
        this.checkQuantity = {
            white: 12,
            black: 12
        };

        this.handleCheckClick = this.handleCheckClick.bind(this);
        this.handleSquareClick = this.handleSquareClick.bind(this);
        this.isSuggested = this.isSuggested.bind(this);

        subscribeToMove((err, move) => {
            this._opponentMove(move)
        })
    
        subscribeToSwitchTurn((err, turn) => {
            this.props.switchTurn(turn)
        })
    }

    componentWillMount() {
        this._startGame();
    }

    componentDidUpdate() {
        if (this.checkQuantity.black === 0) 
            alert(PLAYER_1 + ' won game!');
        else if (this.checkQuantity.white === 0)
            alert(PLAYER_2 + 'won game!');
    }

    handleCheckClick(e, row, column) {
        e.stopPropagation();

        let squares = this.state.squares.slice();
        let check = squares[row][column];

        if (this.killTarget.length > 0) return;

        if (this.props.play.turn === this.props.play.side && check.player === this.props.play.turn) {
            this._resetKillTarget();
            this._deactivateAllchecks(squares);

            squares[row][column] = Object.assign({}, check, { active: true });
            this.setState({ squares });
            this.mustMove = true;

            this.activeRow = row;
            this.activeColumn = column;
            this._suggestSquares(row, column, squares[row][column]);
        }
    }

    handleSquareClick (e, row, column) {
        if (
            this.mustMove && 
            this.isSuggested(row, column) && 
            this.state.squares[this.activeRow][this.activeColumn].player === this.props.play.turn
        ) this._move(row, column);
  
    }

    isSuggested(row, column) {
        return this.state.suggestedSquares.find(
            (square) => row === square.row && column === square.column && !this.state.squares[row][column].player
        ) ? true : false;
    }

    _addKillTarget(target) {
        this.killTarget.push(target);
    }

    _checkForKill(squares, suggestedSquares, row, column) {

        if (squares[row][column].king) {
            // 4 criteria object
            let leftTop = {
                currentRow: row - 1, 
                currentColumn: column - 1
            };

            let rightTop = {
                currentRow: row - 1, 
                currentColumn: column + 1
            };

            let leftBottom = {
                currentRow: row + 1, 
                currentColumn: column - 1
            };

            let rightBottom = {
                currentRow: row + 1, 
                currentColumn: column + 1
            };


            if (leftTop.currentRow > 0 && leftTop.currentRow <= 7 && leftTop.currentColumn > 0 && leftTop.currentColumn <= 7 && this.bannedDirection !== 'TOP_LEFT') {
                let suggestedKill = false;
                
                while (leftTop.currentRow >= 0 && leftTop.currentRow <= 7 && leftTop.currentColumn >= 0 && leftTop.currentColumn <= 7) {

                    if ( squares[leftTop.currentRow][leftTop.currentColumn] && 
                        squares[leftTop.currentRow][leftTop.currentColumn].player && 
                        squares[leftTop.currentRow][leftTop.currentColumn].player !== this.props.play.turn && 
                        squares[leftTop.currentRow - 1] && 
                        squares[leftTop.currentRow - 1][leftTop.currentColumn - 1] && 
                        !squares[leftTop.currentRow - 1][leftTop.currentColumn - 1].player && !suggestedKill ) {

                        let innerRow = leftTop.currentRow - 1;
                        let innerColumn = leftTop.currentColumn - 1;

                        suggestedSquares.push(squares[innerRow][innerColumn]);
                        suggestedKill = true;

                        while(innerRow >= 0 && innerColumn >= 0) {

                            let innerSuggested = squares[innerRow][innerColumn]; 

                            if (innerSuggested && !innerSuggested.player)
                                suggestedSquares.push(innerSuggested);

                            else if (innerSuggested && innerSuggested.player)
                                break;

                            innerRow -= 1;
                            innerColumn -= 1;
                        }

                        this._addKillTarget({ 
                            row: leftTop.currentRow, 
                            column: leftTop.currentColumn
                        });
                    }

                    else if (suggestedKill || (
                        squares[leftTop.currentRow][leftTop.currentColumn].player && 
                        squares[leftTop.currentRow][leftTop.currentColumn].player !== this.props.play.turn && 
                        squares[leftTop.currentRow - 1] && 
                        squares[leftTop.currentRow - 1][leftTop.currentColumn - 1] && 
                        squares[leftTop.currentRow - 1][leftTop.currentColumn - 1].player)
                    ) break;
                    
                    leftTop.currentRow = leftTop.currentRow - 1;
                    leftTop.currentColumn = leftTop.currentColumn - 1;
                }
            }

            if (rightTop.currentRow > 0 && rightTop.currentRow <= 7 && rightTop.currentColumn < 7 && rightTop.currentColumn >= 0 && this.bannedDirection !== 'TOP_RIGHT') {
                let suggestedKill = false;

                while (rightTop.currentRow >= 0 && rightTop.currentRow <= 7 && rightTop.currentColumn <= 7 && rightTop.currentColumn >= 0) {

                    if ( squares[rightTop.currentRow][rightTop.currentColumn] && 
                        squares[rightTop.currentRow][rightTop.currentColumn].player && 
                        squares[rightTop.currentRow][rightTop.currentColumn].player !== this.props.play.turn && 
                        squares[rightTop.currentRow - 1] && 
                        squares[rightTop.currentRow - 1][rightTop.currentColumn + 1] && 
                        !squares[rightTop.currentRow - 1][rightTop.currentColumn + 1].player && 
                        !suggestedKill ) {

                        let innerRow = rightTop.currentRow - 1;
                        let innerColumn = rightTop.currentColumn + 1;

                        suggestedSquares.push(squares[innerRow][innerColumn]);
                        suggestedKill = true;

                        while(innerRow >= 0 && innerColumn <= 7) {

                            let innerSuggested = squares[innerRow][innerColumn]; 

                            if (innerSuggested && !innerSuggested.player)
                                suggestedSquares.push(innerSuggested);

                            else if (innerSuggested && innerSuggested.player)
                                break;

                            innerRow -= 1;
                            innerColumn += 1;
                        }

                        this._addKillTarget({ 
                            row: rightTop.currentRow, 
                            column: rightTop.currentColumn
                        });
                    }

                    else if (suggestedKill || (
                        squares[rightTop.currentRow][rightTop.currentColumn].player && 
                        squares[rightTop.currentRow][rightTop.currentColumn].player !== this.props.play.turn && 
                        squares[rightTop.currentRow - 1] && 
                        squares[rightTop.currentRow - 1][rightTop.currentColumn + 1] && 
                        squares[rightTop.currentRow - 1][rightTop.currentColumn + 1].player)
                    ) break;
                    
                    rightTop.currentRow = rightTop.currentRow - 1;
                    rightTop.currentColumn = rightTop.currentColumn + 1;
                }
            }

            if (leftBottom.currentRow >= 0 && leftBottom.currentRow < 7 && leftBottom.currentColumn > 0 && leftBottom.currentColumn <= 7 && this.bannedDirection !== 'BOTTOM_LEFT') {
                let suggestedKill = false;
                while (leftBottom.currentRow >= 0 && leftBottom.currentRow <= 7 && leftBottom.currentColumn >= 0 && leftBottom.currentColumn <= 7) {

                    if (squares[leftBottom.currentRow][leftBottom.currentColumn] && 
                        squares[leftBottom.currentRow][leftBottom.currentColumn].player && 
                        squares[leftBottom.currentRow][leftBottom.currentColumn].player !== this.props.play.turn && 
                        squares[leftBottom.currentRow + 1] &&
                        squares[leftBottom.currentRow + 1][leftBottom.currentColumn - 1] && 
                        !squares[leftBottom.currentRow + 1][leftBottom.currentColumn - 1].player && !suggestedKill ) {

                        let innerRow = leftBottom.currentRow + 1;
                        let innerColumn = leftBottom.currentColumn - 1;

                        suggestedSquares.push(squares[innerRow][innerColumn]);
                        suggestedKill = true;

                        while(innerRow <= 7 && innerColumn >= 0) {

                            let innerSuggested = squares[innerRow][innerColumn]; 

                            if (innerSuggested && !innerSuggested.player)
                                suggestedSquares.push(innerSuggested);

                            else if (innerSuggested && innerSuggested.player)
                                break;

                            innerRow += 1;
                            innerColumn -= 1;
                        }

                        this._addKillTarget({ 
                            row: leftBottom.currentRow, 
                            column: leftBottom.currentColumn
                        });
                    }

                    else if (suggestedKill || (
                        squares[leftBottom.currentRow][leftBottom.currentColumn].player && 
                        squares[leftBottom.currentRow][leftBottom.currentColumn].player !== this.props.play.turn && 
                        squares[leftBottom.currentRow + 1] &&
                        squares[leftBottom.currentRow + 1][leftBottom.currentColumn - 1] && 
                        squares[leftBottom.currentRow + 1][leftBottom.currentColumn - 1].player)
                    ) break;
                    
                    leftBottom.currentRow = leftBottom.currentRow + 1;
                    leftBottom.currentColumn = leftBottom.currentColumn - 1;
                }
            }

            if (rightBottom.currentRow >= 0 && rightBottom.currentRow < 7 && rightBottom.currentColumn >= 0 && rightBottom.currentColumn < 7  && this.bannedDirection !== 'BOTTOM_RIGHT') {
                let suggestedKill = false;

                while (rightBottom.currentRow >= 0 && rightBottom.currentRow <= 7 && rightBottom.currentColumn >= 0 && rightBottom.currentColumn <= 7) {
                    
                    if ( squares[rightBottom.currentRow][rightBottom.currentColumn] && 
                        squares[rightBottom.currentRow][rightBottom.currentColumn].player && 
                        squares[rightBottom.currentRow][rightBottom.currentColumn].player !== this.props.play.turn && 
                        squares[rightBottom.currentRow + 1] && 
                        squares[rightBottom.currentRow + 1][rightBottom.currentColumn + 1] && 
                        !squares[rightBottom.currentRow + 1][rightBottom.currentColumn + 1].player && 
                        !suggestedKill ) {

                        let innerRow = rightBottom.currentRow + 1;
                        let innerColumn = rightBottom.currentColumn + 1;

                        suggestedSquares.push(squares[innerRow][innerColumn]);
                        suggestedKill = true;

                        while(innerRow <= 7 && innerColumn >= 0) {

                            let innerSuggested = squares[innerRow][innerColumn]; 

                            if (innerSuggested && !innerSuggested.player)
                                suggestedSquares.push(innerSuggested);

                            else if (innerSuggested && innerSuggested.player)
                                break;

                            innerRow += 1;
                            innerColumn += 1;
                        }

                        this._addKillTarget({ 
                            row: rightBottom.currentRow, 
                            column: rightBottom.currentColumn
                        });
                    }

                    else if (suggestedKill || (
                        squares[rightBottom.currentRow][rightBottom.currentColumn].player && 
                        squares[rightBottom.currentRow][rightBottom.currentColumn].player !== this.props.play.turn && 
                        squares[rightBottom.currentRow + 1] && 
                        squares[rightBottom.currentRow + 1][rightBottom.currentColumn + 1] && 
                        squares[rightBottom.currentRow + 1][rightBottom.currentColumn + 1].player)
                    ) break;
                    
                    rightBottom.currentRow = rightBottom.currentRow + 1;
                    rightBottom.currentColumn = rightBottom.currentColumn + 1;
                }
            }
        } else if (!squares[row][column].king && this.props.play.turn === PLAYER_1) {

            if (row < 6 && column >= 0 && column < 6 && squares[row + 1][column + 1].player && squares[row + 1][column + 1].player !== this.props.play.turn && !squares[row + 2][column + 2].player) {
                this._addKillTarget({ 
                    row: row + 1, 
                    column: column + 1 
                });
                suggestedSquares.push(squares[row + 2][column + 2]);
            }
            if (row < 6 && column > 1 && column <= 7 && squares[row + 1][column - 1].player && squares[row + 1][column - 1].player !== this.props.play.turn && !squares[row + 2][column - 2].player) {
                this._addKillTarget({ 
                    row: row + 1, 
                    column: column - 1 
                });
                suggestedSquares.push(squares[row + 2][column - 2]);
            }
            if (row > 1 && column < 6 && squares[row - 1][column + 1].player && squares[row - 1][column + 1].player !== this.props.play.turn && !squares[row - 2][column + 2].player) {
                this._addKillTarget({ 
                    row: row - 1, 
                    column: column + 1 
                });
                suggestedSquares.push(squares[row - 2][column + 2]);
            }
            if (row > 1 && column > 1 && column <= 7 && squares[row - 1][column - 1].player && squares[row - 1][column - 1].player !== this.props.play.turn && !squares[row - 2][column - 2].player) {
                this._addKillTarget({ 
                    row: row - 1, 
                    column: column - 1 
                });
                suggestedSquares.push(squares[row - 2][column - 2]);
            }
        } else if (!squares[row][column].king && this.props.play.turn === PLAYER_2) {
            if (row > 1 && column > 1 && squares[row - 1][column - 1].player && squares[row - 1][column - 1].player !== this.props.play.turn &&  !squares[row - 2][column - 2].player) {
                this._addKillTarget({ 
                    row: row - 1, 
                    column: column - 1 
                });
                suggestedSquares.push(squares[row - 2][column - 2]);
            }
            if (row > 1 && column < 6 && squares[row - 1][column + 1].player && squares[row - 1][column + 1].player !== this.props.play.turn && !squares[row - 2][column + 2].player) {
                this._addKillTarget({ 
                    row: row - 1, 
                    column: column + 1 
                });
                suggestedSquares.push(squares[row - 2][column + 2]);
            }
            if (row < 6 && column > 1 && squares[row + 1][column - 1].player && squares[row + 1][column - 1].player !== this.props.play.turn &&  !squares[row + 2][column - 2].player) {
                this._addKillTarget({ 
                    row: row + 1, 
                    column: column - 1 
                });
                suggestedSquares.push(squares[row + 2][column - 2]);
            }
            if (row < 6 && column < 6 && squares[row + 1][column + 1].player && squares[row + 1][column + 1].player !== this.props.play.turn &&  !squares[row + 2][column + 2].player) {
                this._addKillTarget({ 
                    row: row + 1, 
                    column: column + 1 
                });
                suggestedSquares.push(squares[row + 2][column + 2]);
            }
        }
    }

    _checkForKing(checker) {
        
        if (checker.player === PLAYER_1 && checker.row === 7) {
            checker.king = true;
        } else if (checker.player === PLAYER_2 && checker.row === 0) {
            checker.king = true;
        }

    }

    _deactivateAllchecks(squares) {

        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares.length; j++) {
                let val = squares[i][j];

                if (val && val.active) 
                    val.active = false;  
                
                squares[i][j] = val;
            }
        } 
    }

    _killProperCheck (startRow, startColumn, endRow, endColumn) {
        let targetIndex = this.killTarget.findIndex((target, index) => {
            return (startRow < target.row && endRow > target.row && startColumn < target.column && endColumn > target.column) ||
                (startRow < target.row && endRow > target.row && startColumn > target.column && endColumn < target.column) ||
                (startRow > target.row && endRow < target.row && startColumn < target.column && endColumn > target.column) ||
                (startRow > target.row && endRow < target.row && startColumn > target.column && endColumn < target.column);
        });

        return targetIndex;
    }
    
    _move(row, column) {
        let squares = this.state.squares.slice();
        let activeChecker = squares[this.activeRow][this.activeColumn];
        let suggestedSquares = [];
        let emitObj = {
            from: {
                row: this.activeRow,
                column: this.activeColumn  
            }
        }
        // change checker location with another square
        squares[row][column] = activeChecker;
        squares[this.activeRow][this.activeColumn] = { row: activeChecker.row, column: activeChecker.column };
        
        activeChecker.row = row;
        activeChecker.column = column;

        emitObj.activeChecker = activeChecker
        // if move is kill operation check if there is another kill probability
        if (this.killTarget.length > 0) {

            let targetIndex = this._killProperCheck(this.activeRow, this.activeColumn, row, column);
            squares[this.killTarget[targetIndex].row][this.killTarget[targetIndex].column].player === PLAYER_1 ? this.checkQuantity.white -= 1 : this.checkQuantity.black -= 1;
            // remove killed check from board
            squares[this.killTarget[targetIndex].row][this.killTarget[targetIndex].column] = this.killTarget[targetIndex];
            emitObj.killTarget = this.killTarget[targetIndex]

            if (this.activeRow < row && this.activeColumn < column)
                this.bannedDirection = 'TOP_LEFT';
            else if (this.activeRow < row && this.activeColumn > column)
                this.bannedDirection = 'TOP_RIGHT';
            else if (this.activeRow > row && this.activeColumn < column)
                this.bannedDirection = 'BOTTOM_LEFT';
            else if (this.activeRow > row && this.activeColumn > column)
                this.bannedDirection = 'BOTTOM_RIGHT';
            
            this._resetKillTarget();
            this._checkForKill(squares, suggestedSquares, row, column);

        }

        // change active row and column due to moved checher
        this.activeColumn = column;        
        this.activeRow = row;    

        if ( !activeChecker.king ) 
            this._checkForKing(activeChecker);

        // if there is not additional kill deactivate active squares
        // switch turn
        if (suggestedSquares.length === 0) {
            this._switchTurn();
            this._deactivateAllchecks(squares);
            this.bannedDirection = null;
        }

        // emit move
        emitMove(emitObj)

        this.setState({ 
            squares,
            suggestedSquares 
        });
        
    }

    _opponentMove = ({ from, activeChecker, killTarget }) => {
        let squares = this.state.squares.slice()

        squares[from.row][from.column] = from
        squares[activeChecker.row][activeChecker.column] = activeChecker

        if (killTarget) 
            squares[killTarget.row][killTarget.column] = killTarget
        
        this.setState(squares)
    }

    _resetKillTarget() {
        this.killTarget = [];
    }

    _startGame() {
        let squares = this.state.squares.slice();

        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares.length; j++) {
                let val = squares[i][j];

                let check = Object.assign({}, val, {
                    row: i,
                    column: j,
                });

                if (val && val.player) {
                    check.turn = val.player;
                    check.active = false;  
                }

                squares[i][j] = check;
            }
        } 

        this.setState({ squares });
    }

    _suggestSquares(row, column, activeChecker) {
        let { squares } = this.state;
        let suggestedSquares = [];

        if (activeChecker.player && activeChecker.player === PLAYER_1 && !activeChecker.king) {
            
            this._checkForKill(squares, suggestedSquares, row, column);

            if (suggestedSquares.length === 0) {
                if (row < 7 && column > 0 && column <= 7 && !squares[row + 1][column - 1].player)
                    suggestedSquares.push(squares[row + 1][column - 1]);
                if (row < 7 && column >= 0 && column < 7 && !squares[row + 1][column + 1].player)
                    suggestedSquares.push(squares[row + 1][column + 1]);
            }

            
       
        } else if (activeChecker.player && activeChecker.player === PLAYER_2 && !activeChecker.king) {
            
            this._checkForKill(squares, suggestedSquares, row, column);
            
            if (suggestedSquares.length === 0) {
                if (row <= 7 && row > 0 && column > 0 && !squares[row - 1][column - 1].player)
                    suggestedSquares.push(squares[row - 1][column - 1]);
                if (row <= 7 && row > 0 && column >= 0 && column < 7 && !squares[row - 1][column + 1].player)
                    suggestedSquares.push(squares[row - 1][column + 1]);
            }

        } else if (activeChecker.player && activeChecker.king) {

            this._checkForKill(squares, suggestedSquares, row, column);

            let leftTop = {
                currentRow: row - 1, 
                currentColumn: column - 1
            };

            let rightTop = {
                currentRow: row - 1, 
                currentColumn: column + 1
            };

            let leftBottom = {
                currentRow: row + 1, 
                currentColumn: column - 1
            };

            let rightBottom = {
                currentRow: row + 1, 
                currentColumn: column + 1
            };

            if (this.killTarget.length === 0) {

                while (leftTop.currentRow >= 0 && leftTop.currentColumn >= 0) {

                    let suggested = squares[leftTop.currentRow][leftTop.currentColumn]; 

                    if (suggested && !suggested.player)
                        suggestedSquares.push(suggested);
                    else if (suggested && suggested.player)
                        break;

                    leftTop.currentRow = leftTop.currentRow - 1;
                    leftTop.currentColumn = leftTop.currentColumn - 1;
                }
            // }

            // if (rightTop.currentRow > 0 && rightTop.currentColumn <= 7 && this.killTarget.length === 0) {

                while (rightTop.currentRow >= 0 && rightTop.currentColumn <= 7) {

                    let suggested = squares[rightTop.currentRow][rightTop.currentColumn]; 

                    if (suggested && !suggested.player)
                        suggestedSquares.push(suggested);
                    else if (suggested && suggested.player)
                        break;

                    rightTop.currentRow = rightTop.currentRow - 1;
                    rightTop.currentColumn = rightTop.currentColumn + 1;
                }
            // }

            // if (leftBottom.currentRow < 7 && leftBottom.currentColumn > 0 && this.killTarget.length === 0) {

                while (leftBottom.currentRow <= 7 && leftBottom.currentColumn >= 0) {

                    let suggested = squares[leftBottom.currentRow][leftBottom.currentColumn]; 

                    if (suggested && !suggested.player)
                        suggestedSquares.push(suggested);
                    else if (suggested && suggested.player)
                        break;

                    leftBottom.currentRow = leftBottom.currentRow + 1;
                    leftBottom.currentColumn = leftBottom.currentColumn - 1;
                }
            // }

            // if (rightBottom.currentRow < 7 && rightBottom.currentColumn <= 7 && this.killTarget.length === 0) {

                while (rightBottom.currentRow <= 7 && rightBottom.currentColumn <= 7) {

                    let suggested = squares[rightBottom.currentRow][rightBottom.currentColumn]; 

                    if (suggested && !suggested.player)
                        suggestedSquares.push(suggested);
                    else if (suggested && suggested.player)
                        break;

                    rightBottom.currentRow = rightBottom.currentRow + 1;
                    rightBottom.currentColumn = rightBottom.currentColumn + 1;
                }
            }

        }

        this.setState({ suggestedSquares })

    }
    
    _switchTurn () {
        let turn = (this.props.play.turn === PLAYER_1) ? PLAYER_2 : PLAYER_1
        // this.setState({ turn }); 
        emitSwitchTurn(turn)
        this.props.switchTurn(turn)
    }

    render () {

        return (
            <div className="game">
                <Description turn={this.props.play.turn} />
                <Board 
                    squares={this.state.squares} 
                    suggestedSquares={this.state.suggestedSquares}
                    isSuggested={this.isSuggested}
                    onCheckClick={this.handleCheckClick}
                    onSquareClick={this.handleSquareClick}
                    rotate={this.props.play.side === PLAYER_1}
                />
            </div>
        );
    }

}

const mstp = ({ play }) => ({
    play
})

const mdtp = dispatch => ({
    switchTurn: turn => dispatch(switchTurn(turn))
})

export default connect(mstp, mdtp)(Game);
