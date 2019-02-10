import { UPDATE_VIEW_SETTINGS } from './redux.actions.types';

export const updateViewSettings = (payload) => {
    return { type: UPDATE_VIEW_SETTINGS, payload };
}