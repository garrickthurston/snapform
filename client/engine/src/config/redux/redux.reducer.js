import { UPDATE_VIEW_SETTINGS, G_CLICKED, ADD_INPUT_VALUE_CHANGED, ADD_INPUT_TAG_CHANGED, UPDATE_PROJECT, ADD_PROJECT_FORM, UPDATE_PROJECT_ITEMS, UPDATE_PROJECT_CONTAINER } from './redux.actions.types';

const initialState = {
    workspace: {
        project: {
            config: {},
            ui: {
                gClassList: 'gid',
            },
            add: {},
            items: {}
        }
    }
};

export const engineReducer = (state = initialState, action) => {
    var workspace = Object.assign({}, state.workspace);
    switch (action.type) {
        case ADD_PROJECT_FORM:
            workspace.project.id = payload;
            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_VIEW_SETTINGS:
            workspace.project.config.viewWidth = action.payload.viewWidth || state.workspace.project.config.viewWidth;
            workspace.project.config.viewHeight = action.payload.viewHeight || state.workspace.project.config.viewHeight;
            workspace.project.config.cellWidth = action.payload.cellWidth || state.workspace.project.config.cellWidth;
            workspace.project.config.cellHeight = action.payload.cellHeight || state.workspace.project.config.cellHeight;
            workspace.project.config.cellTransform = action.payload.cellTransform || state.workspace.project.config.cellTransform;
            workspace.project.config.current_x = action.payload.current_x || state.workspace.project.config.current_x;
            workspace.project.config.current_y = action.payload.current_y || state.workspace.project.config.current_y;
            return Object.assign({}, state, {
                workspace
            });
        case G_CLICKED:
            workspace.project.config.cellTransform = action.payload.cellTransform || state.workspace.project.config.cellTransform;
            workspace.project.config.current_x = action.payload.current_x || state.workspace.project.config.current_x;
            workspace.project.config.current_y = action.payload.current_y || state.workspace.project.config.current_y;
            workspace.project.add.addComponent = action.payload.addComponent;
            workspace.project.ui.gClassList = action.payload.gClassList || state.workspace.ui.project.gClassList;
            return Object.assign({}, state, {
                workspace
            });
        case ADD_INPUT_VALUE_CHANGED:
            workspace.project.add.addInputValue = action.payload;
            return Object.assign({}, state, {
                workspace
            });
        case ADD_INPUT_TAG_CHANGED:
            workspace.project.add.addInputTag = action.payload;
            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT:
            const parts = action.payload.path.split('.');

            var item = workspace.project.items;
            parts.forEach((part, i) => {
                if ((i + 1) === parts.length) {
                    item[part] = action.payload.value;
                } else {
                    item = item[part];
                }
            });
            
            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT_ITEMS:
            workspace.project.items = action.payload;

            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT_CONTAINER:
            workspace.project.container = action.payload;
            return Object.assign({}, state, {
                workspace
            });
    }
    
    return state;
};