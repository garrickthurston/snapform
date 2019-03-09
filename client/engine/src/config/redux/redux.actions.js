import { INIT_PROJECT, UPDATE_PROJECT, UPDATE_PROJECT_ITEMS, UPDATE_PROJECT_CONTAINER, UPDATE_PROJECT_CONFIG } from './redux.actions.types';

export const initProject = (payload) => {
    return { type: INIT_PROJECT, payload };
};

export const updateProject = (payload) => {
    return { type: UPDATE_PROJECT, payload };  
};

export const updateProjectItems = (payload) => {
    return { type: UPDATE_PROJECT_ITEMS, payload };
};

export const updateProjectContainer = (payload) => {
    return { type: UPDATE_PROJECT_CONTAINER, payload };
};

export const updateProjectConfig = (payload) => {
    return { type: UPDATE_PROJECT_CONFIG, payload };
};