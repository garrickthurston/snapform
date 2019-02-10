import React from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import AppComponent from './app.component';
import LoginComponent from '../internal/login.component';
import DashboardComponent from '../external/dashboard.component';

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <AppComponent>
                <Switch>
                    <Route path="/login" component={LoginComponent} />
                    <Route path="/" component={DashboardComponent} />
                </Switch>
            </AppComponent>
        </Router>
    </Provider>
);

export default Root;