import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import  thunk from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'

import usernameReducer from './reducers/usernameReducer'
import usersReducer from './reducers/usersReducer'
import messageReducer from './reducers/messageReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    username: usernameReducer,
    activeUsers: usersReducer,
    messages: messageReducer,
    form: formReducer
})

export default createStore(
    reducers, 
    composeEnhancers(
        applyMiddleware(thunk),
    )
)
