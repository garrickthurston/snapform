import React, { Suspense } from 'react';
import {
    Route,
    Switch,
    BrowserRouter,
    Redirect
} from 'react-router-dom';
import AuthedRoute from './core/AuthedRoute';
import LoadingPulse from './core/LoadingPulse';

const AuthFlow = React.lazy(() => import(/* webpackChunkName: 'authflow' */'./external/AuthFlow/AuthFlow'));
const Docs = React.lazy(() => import(/* webpackChunkName: 'docs' */'./external/Docs'));
const Blog = React.lazy(() => import(/* webpackChunkName: 'blog' */'./external/Blog'));
const Tutorial = React.lazy(() => import(/* webpackChunkName: 'tutorial' */'./external/Tutorial'));
const WorkspaceRoot = React.lazy(() => import(/* webpackChunkName: 'workspace' */'./workspace/WorkspaceRoot'));
const Dashboard = React.lazy(() => import(/* webpackChunkName: 'dashboard' */'./external/Dashboard'));

export default function Routes({ children }) {
    return (
        <BrowserRouter>
            {children}
            <Suspense fallback={<LoadingPulse fullScreen />}>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/login" component={AuthFlow} />
                    <Route path="/docs" component={Docs} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/tutorial" component={Tutorial} />
                    <AuthedRoute path="/workspace/:workspaceId?/:projectId?" component={WorkspaceRoot} />
                    <Route render={() => <Redirect to="/" />} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}
