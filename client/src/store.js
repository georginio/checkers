import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import  thunk from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'

import userReducer from './reducers/userReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    user: userReducer,
    form: formReducer
})

export default createStore(
    reducers, 
    composeEnhancers(
        applyMiddleware(thunk),
    )
)
