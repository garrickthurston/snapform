import { UPDATE_VIEW_SETTINGS, UPDATE_BG_IMAGE, UPDATE_TOKEN } from './redux.actions.types';

export const updateViewSettings = (payload) => {
    return { type: UPDATE_VIEW_SETTINGS, payload };
};

export const updateBGImage = (payload) => {
    return { type: UPDATE_BG_IMAGE, payload };
};

export const updateToken = (payload) => {
    return { type: UPDATE_TOKEN, payload };
};