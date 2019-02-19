import { UPDATE_VIEW_SETTINGS, G_CLICKED, ADD_INPUT_VALUE_CHANGED, ADD_INPUT_TAG_CHANGED, ADD_PROJECT_FORM, UPDATE_PROJECT } from './redux.actions.types';

export const updateViewSettings = (payload) => {
    return { type: UPDATE_VIEW_SETTINGS, payload };
}

export const gClicked = (payload) => {
    return { type: G_CLICKED, payload };
};

export const addInputValueChanged = (payload) => {
    return { type: ADD_INPUT_VALUE_CHANGED, payload };
};

export const addInputTagChanged = (payload) => {
    return { type: ADD_INPUT_TAG_CHANGED, payload };
};

export const addProjectForm = (payload) => {
    return { type: ADD_PROJECT_FORM, payload }
};

export const updateProject = (payload) => {
    return { type: UPDATE_PROJECT, payload };  
};