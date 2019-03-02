import React from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { PrivateRoute } from './privateroute.component';
import Loadable from 'react-loadable';

import LoadingComponent from './loading.component';

const AppComponent = Loadable({
    loader: () => import ('./app.component'),
    loading: LoadingComponent
});
const LoginComponent = Loadable({
    loader: () => import ('../external/login.component'),
    loading: LoadingComponent
});
const DashboardComponent = Loadable({
    loader: () => import ('../internal/dashboard.component'),
    loading: LoadingComponent
});
const DocsComponent = Loadable({
    loader: () => import ('../external/docs.component'),
    loading: LoadingComponent
});
const HomeComponent = Loadable({
    loader: () => import ('../external/home.component'),
    loading: LoadingComponent
});
const BlogComponent = Loadable({
    loader: () => import ('../external/blog.component'),
    loading: LoadingComponent
});
const TutorialComponent = Loadable({
    loader: () => import ('../external/tutorial.component'),
    loading: LoadingComponent
});

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