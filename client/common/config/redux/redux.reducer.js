import { combineReducers } from 'redux';
import { appReducer } from '../../../app/src/config/redux/redux.reducer';
import { engineReducer } from '../../../engine/src/config/redux/redux.reducer';

export const reducer = combineReducers({
    appReducer,
    engineReducer
});