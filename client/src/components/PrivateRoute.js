import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import isAuthed from '../isAuthed'

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route 
            {...rest}
            render={ props =>
                isAuthed() ? (
                    <component {...props} /> 
                ) : (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} /> 
                )
            }
        />
    )
}

export default PrivateRoute
