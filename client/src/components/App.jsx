import React from 'react';
import UserProvider from '../contexts/providers/UserContextProvider';
import Menu from './Menu';
import Routes from './Routes';
import './App.scss';

export default function App() {
    return (
        <UserProvider initialState={{}}>
            <Routes>
                <Menu />
            </Routes>
        </UserProvider>
    );
}
