import React, { Suspense } from 'react';
import {
    Route,
    Switch,
    BrowserRouter,
    Redirect
} from 'react-router-dom';
import AuthedRoute from './core/AuthedRoute';
import LoadingComponent from './core/LoadingComponent';

const AuthFlowComponent = React.lazy(() => import(/* webpackChunkName: 'authflow' */'./external/AuthFlow/AuthFlowComponent'));
const DocsComponent = React.lazy(() => import(/* webpackChunkName: 'docs' */'./external/DocsComponent'));
const BlogComponent = React.lazy(() => import(/* webpackChunkName: 'blog' */'./external/BlogComponent'));
const TutorialComponent = React.lazy(() => import(/* webpackChunkName: 'tutorial' */'./external/TutorialComponent'));
const WorkspaceRootComponent = React.lazy(() => import(/* webpackChunkName: 'workspace' */'./workspace/WorkspaceRootComponent'));
const DashboardComponent = React.lazy(() => import(/* webpackChunkName: 'dashboard' */'./external/DashboardComponent'));

export default function Routes({ children }) {
    return (
        <BrowserRouter>
            {children}
            <Suspense fallback={<LoadingComponent fullScreen />}>
                <Switch>
                    <Route exact path="/" component={DashboardComponent} />
                    <Route path="/login" component={AuthFlowComponent} />
                    <Route path="/docs" component={DocsComponent} />
                    <Route path="/blog" component={BlogComponent} />
                    <Route path="/tutorial" component={TutorialComponent} />
                    <AuthedRoute path="/workspace/:workspaceId?/:projectId?" component={WorkspaceRootComponent} />
                    <Route render={() => <Redirect to="/" />} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}
