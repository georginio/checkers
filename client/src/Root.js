import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import PrivateRoute from './components/PrivateRoute'
import Dashboard from './scenes/Dashboard'
import Game from './Game'

const Root = ({ store }) =>
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={Dashboard} />
                <PrivateRoute path="/game/:roomname" component={Game} />
            </div>
        </Router>
    </Provider>

export default Root
