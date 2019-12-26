import React from 'react';
import { useRoutes } from 'hookrouter';
import routes, { wrapSuspense } from '../contexts/routes';
import UserProvider from '../contexts/providers/UserContextProvider';
import MenuComponent from './MenuComponent';
import './AppComponent.scss';

const NotFoundComponent = React.lazy(() => import(/* webpackChunkName: 'notFound' */'./NotFoundComponent'));

export default function AppComponent() {
    const routeResult = useRoutes(routes);

    return (
        <UserProvider initialState={{}}>
            <MenuComponent />
            {routeResult || wrapSuspense(<NotFoundComponent />)}
        </UserProvider>
    );
}
