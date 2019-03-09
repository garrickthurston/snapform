import { createStore } from 'redux';
import { reducer } from './redux.reducer';

export const store = createStore(reducer);