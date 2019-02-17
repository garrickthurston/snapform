import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { store } from '../config/redux/redux.store';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { token, user } = store.getState();
    return (
        <Route {...rest} 
            render={(props) => 
                !!token && !!user
                    ? <Component {...props} /> 
                    : <Redirect to={{ pathname: '/', state: { from: props.location } }} />} />
    )
};