import { UPDATE_VIEW_SETTINGS, G_CLICKED } from './redux.actions.types';

const initialState = {
    gClassList: 'gid'
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
    }
    return state;
};