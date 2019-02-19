import { UPDATE_VIEW_SETTINGS, G_CLICKED, ADD_INPUT_VALUE_CHANGED, ADD_INPUT_TAG_CHANGED, UPDATE_PROJECT, ADD_PROJECT_FORM } from './redux.actions.types';

const initialState = {
    workspace: {
        project: {
            gClassList: 'gid',
            add: {},
            items: {}
        }
    }
};

export const reducer = (state = initialState, action) => {
    var workspace = Object.assign({}, state.workspace);
    switch (action.type) {
        case ADD_PROJECT_FORM:
            workspace.project.id = payload;
            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_VIEW_SETTINGS:
            workspace.project.viewWidth = action.payload.viewWidth || state.workspace.project.viewWidth;
            workspace.project.viewHeight = action.payload.viewHeight || state.workspace.project.viewHeight;
            workspace.project.cellWidth = action.payload.cellWidth || state.workspace.project.cellWidth;
            workspace.project.cellHeight = action.payload.cellHeight || state.workspace.project.cellHeight;
            workspace.project.cellTransform = action.payload.cellTransform || state.workspace.project.cellTransform;
            workspace.project.current_x = action.payload.current_x || state.workspace.project.current_x;
            workspace.project.current_y = action.payload.current_y || state.workspace.project.current_y;
            return Object.assign({}, state, {
                workspace
            });
        case G_CLICKED:
            workspace.project.cellTransform = action.payload.cellTransform || state.workspace.project.cellTransform;
            workspace.project.current_x = action.payload.current_x || state.workspace.project.current_x;
            workspace.project.current_y = action.payload.current_y || state.workspace.project.current_y;
            workspace.project.add.addComponent = action.payload.addComponent;
            workspace.project.gClassList = action.payload.gClassList || state.workspace.project.gClassList;
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
    }
    return state;
};