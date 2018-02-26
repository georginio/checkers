import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

const GameHOC = WrappedComponent => 
    class GameHOC extends Component {
        render() {
            let { play } = this.props

            if (!play.roomName)
                return <Redirect to={{ pathname: '/'}} /> 
            
            return <WrappedComponent {...this.props} />
        }
    }

export default GameHOC    
