import { UPDATE_TOKEN } from './redux.actions.types';

export const updateToken = (payload) => {
    return { type: UPDATE_TOKEN, payload };
};