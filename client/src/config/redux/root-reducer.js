import { UPDATE_VIEW_SETTINGS } from './redux.actions.types';

const initialState = {
    
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_VIEW_SETTINGS:
            return Object.assign({}, state, {
                viewWidth: action.payload.viewWidth || state.viewWidth,
                viewHeight: action.payload.viewHeight || state.viewHeight,
                cellWidth: action.payload.cellWidth || state.cellWidth,
                cellHeight: action.payload.cellHeight || state.cellHeight,
                cellTransform: action.payload.cellTransform || state.cellTransform
            });
    }
    return state;
};

export default reducer;