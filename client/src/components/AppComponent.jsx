import React from 'react';
import UserProvider from '../contexts/providers/UserContextProvider';
import MenuComponent from './MenuComponent';
import Routes from './Routes';
import './AppComponent.scss';

export default function AppComponent() {
    return (
        <UserProvider initialState={{}}>
            <Routes>
                <MenuComponent />
            </Routes>
        </UserProvider>
    );
}
