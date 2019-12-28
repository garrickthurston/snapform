import React, { Suspense } from 'react';
import {
    Route,
    Switch,
    BrowserRouter,
    Redirect
} from 'react-router-dom';
import AuthedRoute from './core/AuthedRoute';

const AuthFlowComponent = React.lazy(() => import(/* webpackChunkName: 'authflow' */'./external/AuthFlow/AuthFlowComponent'));
const DocsComponent = React.lazy(() => import(/* webpackChunkName: 'docs' */'./external/DocsComponent'));
const BlogComponent = React.lazy(() => import(/* webpackChunkName: 'blog' */'./external/BlogComponent'));
const TutorialComponent = React.lazy(() => import(/* webpackChunkName: 'tutorial' */'./external/TutorialComponent'));
const WorkspaceComponent = React.lazy(() => import(/* webpackChunkName: 'workspace' */'./workspace/WorkspaceComponent'));
const DashboardComponent = React.lazy(() => import(/* webpackChunkName: 'dashboard' */'./external/DashboardComponent'));

export default function Routes({ children }) {
    return (
        <BrowserRouter>
            {children}
            {/* TODO - add actual loading component */}
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/" component={DashboardComponent} />
                    <Route path="/login" component={AuthFlowComponent} />
                    <Route path="/docs" component={DocsComponent} />
                    <Route path="/blog" component={BlogComponent} />
                    <Route path="/tutorial" component={TutorialComponent} />
                    <AuthedRoute path="/workspace/:workspaceId?/:projectId?" component={WorkspaceComponent} />
                    <Route render={() => <Redirect to="/" />} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}
