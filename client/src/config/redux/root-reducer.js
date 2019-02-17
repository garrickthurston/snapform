import { UPDATE_VIEW_SETTINGS, UPDATE_BG_IMAGE, UPDATE_TOKEN } from './redux.actions.types';
const jwt = require('jsonwebtoken');

const token = localStorage.getItem('token');
const initialState = {
    token: token,
    user: token ? jwt.decode(token) : null
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_VIEW_SETTINGS:
            return Object.assign({}, state, {
                viewWidth: action.payload.viewWidth || state.viewWidth,
                viewHeight: action.payload.viewHeight || state.viewHeight,
                cellWidth: action.payload.cellWidth || state.cellWidth,
                cellHeight: action.payload.cellHeight || state.cellHeight,
                cellTransform: action.payload.cellTransform || state.cellTransform
            });
        case UPDATE_BG_IMAGE:
            return Object.assign({}, state, {
                backgroundImage: action.payload || state.backgroundImage
            });
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