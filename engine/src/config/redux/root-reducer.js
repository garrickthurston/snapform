import { UPDATE_VIEW_SETTINGS, G_CLICKED, ADD_INPUT_VALUE_CHANGED, ADD_INPUT_TAG_CHANGED, UPDATE_PROJECT } from './redux.actions.types';

const initialState = {
    gClassList: 'gid',
    project: {
        form_1: {

        }
    }
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_VIEW_SETTINGS:
            return Object.assign({}, state, {
                viewWidth: action.payload.viewWidth || state.viewWidth,
                viewHeight: action.payload.viewHeight || state.viewHeight,
                cellWidth: action.payload.cellWidth || state.cellWidth,
                cellHeight: action.payload.cellHeight || state.cellHeight,
                cellTransform: action.payload.cellTransform || state.cellTransform,
                current_x: action.payload.current_x || state.current_x,
                current_y: action.payload.current_y || state.current_y
            });
        case G_CLICKED:
            return Object.assign({}, state, {
                cellTransform: action.payload.cellTransform || state.cellTransform,
                current_x: action.payload.current_x || state.current_x,
                current_y: action.payload.current_y || state.current_y,
                addComponent: action.payload.addComponent,
                gClassList: action.payload.gClassList || state.gClassList
            });
        case ADD_INPUT_VALUE_CHANGED:
            return Object.assign({}, state, {
                addInputValue: action.payload 
            });
        case ADD_INPUT_TAG_CHANGED:
            return Object.assign({}, state, {
                addInputTag: action.payload 
            });
        case UPDATE_PROJECT:
            var project = JSON.parse(JSON.stringify(state.project));
            const parts = action.payload.path.split('.');

            var item = project;
            parts.forEach((part, i) => {
                if ((i + 1) === parts.length) {
                    item[part] = action.payload.value;
                } else {
                    item = item[part];
                }
            });
            
            return Object.assign({}, state, {
                project: project
            });
    }
    return state;
};