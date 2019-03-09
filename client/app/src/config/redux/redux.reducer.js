import { UPDATE_TOKEN } from './redux.actions.types';
const jwt = require('jsonwebtoken');

const token = localStorage.getItem('token');
const initialState = {
    token: token,
    user: token ? jwt.decode(token) : null
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TOKEN:
            if (action.payload) {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
            return Object.assign({}, state, {
                token: action.payload,
                user: action.payload ? jwt.decode(action.payload) : null
            });
    }
    return state;
};