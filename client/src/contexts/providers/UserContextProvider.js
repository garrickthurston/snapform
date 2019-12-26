import React, { useReducer, useContext } from 'react';
import UserContext from '../UserContext';

export const userActionTypes = {

};

export function userReducer(state/* , action */) {
    // switch (action.type) {
    //     default:
    //         return state;
    // }

    return state;
}

function UserContextProvider({ children/* , initialState = {} */ }) {
    const [state/* , dispatch */] = useReducer(userReducer, {
        userId: undefined
    });
    const context = {
        ...state,
        actions: {

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
        throw new Error('useUser can\'t be used outside of a UserProvider');
    }

    return context;
};
