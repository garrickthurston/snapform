import React from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { PrivateRoute } from './privateroute.component';

import AppComponent from './app.component';
import LoginComponent from '../internal/login.component';
import DashboardComponent from '../internal/dashboard.component';
import DocsComponent from '../external/docs.component';
import HomeComponent from '../external/home.component';
import BlogComponent from '../external/blog.component';
import TutorialComponent from '../external/tutorial.component';

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <AppComponent>
                <Switch>
                    <Route path="/login" component={LoginComponent} />
                    <Route path="/docs" component={DocsComponent} />
                    <Route path="/blog" component={BlogComponent} />
                    <Route path="/tutorial" component={TutorialComponent} />
                    <PrivateRoute path="/dashboard" component={DashboardComponent} />
                    <Route path="/" component={HomeComponent} />
                </Switch>
            </AppComponent>
        </Router>
    </Provider>
);

export default Root;