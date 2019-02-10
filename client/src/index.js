import React from 'react';
import ReactDOM from 'react-dom';
import store from './config/redux/redux.store';
import RootComponent from './shared/root.component';

import '../assets/style/root.scss';

ReactDOM.render(
    <RootComponent store={store} />, 
    document.getElementById('root')
);