import React, { useReducer, useContext } from 'react';
import UserContext from '../UserContext';
import authApi from '../../services/auth.api.service';

export const userActionTypes = {
    authenticateUser: 'AUTHENTICATE_USER',
    unauthenticateUser: 'UNAUTHENTICATE_USER'
};

function authenticateUser(dispatch) {
    return async (username, password) => {
        let payload = {};
        try {
            payload = await authApi.authenticateUser(username, password);
        } finally {
            dispatch({ type: userActionTypes.authenticateUser, payload });
        }
    };
}

function unauthenticateUser(dispatch) {
    return () => {
        authApi.unauthenticateUser();
        dispatch({ type: userActionTypes.unauthenticateUser });
    };
}

export function userReducer(state, action) {
    switch (action.type) {
        case userActionTypes.authenticateUser:
            return {
                ...state,
                data: {
                    ...action.payload
                }
            };
        case userActionTypes.unauthenticateUser:
            return {
                ...state,
                data: null
            };
        default:
            return state;
    }
}

function UserContextProvider({ children, initialState = {} }) {
    const user = authApi.getUser();

    const [state, dispatch] = useReducer(userReducer, {
        data: {
            ...user,
            isAdmin: user && user.role === 'admin'
        },
        ...initialState
    });
    const context = {
        ...state,
        actions: {
            authenticateUser: authenticateUser(dispatch, state),
            unauthenticateUser: unauthenticateUser(dispatch, state)
        }
    };

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context.actions) {
        throw new Error('useUser can\'t be used outside of a UserContextProvider');
    }

    return context;
};
