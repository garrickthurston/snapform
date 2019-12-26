import React, { Suspense } from 'react';

const LoginComponent = React.lazy(() => import(/* webpackChunkName: 'login' */'../components/external/LoginComponent'));
const DocsComponent = React.lazy(() => import(/* webpackChunkName: 'docs' */'../components/external/DocsComponent'));
const BlogComponent = React.lazy(() => import(/* webpackChunkName: 'blog' */'../components/external/BlogComponent'));
const TutorialComponent = React.lazy(() => import(/* webpackChunkName: 'tutorial' */'../components/external/TutorialComponent'));
const WorkspaceComponent = React.lazy(() => import(/* webpackChunkName: 'workspace' */'../components/internal/WorkspaceComponent'));
const DashboardComponent = React.lazy(() => import(/* webpackChunkName: 'dashboard' */'../components/external/DashboardComponent'));

// TODO: add LoaderComponent
export const wrapSuspense = (children) => (<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>);

export default {
    '/login': () => wrapSuspense(<LoginComponent />),
    '/docs': () => wrapSuspense(<DocsComponent />),
    '/blog': () => wrapSuspense(<BlogComponent />),
    '/tutorial': () => wrapSuspense(<TutorialComponent />),
    '/workspace': () => wrapSuspense(<WorkspaceComponent />),
    // TODO: auth
    '/workspace/:workspaceId': ({ workspaceId }) => wrapSuspense(<WorkspaceComponent workspaceId={workspaceId} />),
    '/workspace/:workspaceId/project/:projectId': ({ workspaceId, projectId }) => wrapSuspense(<WorkspaceComponent workspaceId={workspaceId} projectId={projectId} />),
    '/': () => wrapSuspense(<DashboardComponent />)
};
