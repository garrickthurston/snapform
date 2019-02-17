import { UPDATE_VIEW_SETTINGS, G_CLICKED } from './redux.actions.types';

export const updateViewSettings = (payload) => {
    return { type: UPDATE_VIEW_SETTINGS, payload };
}

export const gClicked = (payload) => {
    return { type: G_CLICKED, payload };
};