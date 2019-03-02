import React from 'react';
import ReactDOM from 'react-dom';
import RootComponent from './shared/root.component';
import { store } from '../../common/config/redux/redux.store';

import $ from 'jquery';
import 'bootstrap';
import '../assets/style/root.scss';

ReactDOM.render(
    <RootComponent store={store} />, 
    document.getElementById('root')
);