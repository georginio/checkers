import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import Dashboard from './scenes/Dashboard'
import App from './App'

const Root = ({ store }) =>
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/Game" component={App} />
            </div>
        </Router>
    </Provider>

export default Root
