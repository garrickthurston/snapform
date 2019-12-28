/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from '../../contexts/providers/UserContextProvider';

export default function AuthedRoute({ component: Component, ...otherProps }) {
    const user = useUser();

    const renderComponent = (props) => {
        if (user.data) {
            return (<Component {...props} />);
        }

        const { location } = props;
        return (<Redirect to={{ pathname: '/login', state: { from: location } }} />);
    };

    return (
        <Route
            {...otherProps}
            render={renderComponent}
        />
    );
}
/* eslint-disable react/jsx-props-no-spreading */
