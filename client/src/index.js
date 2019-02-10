import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './config/redux/redux.store';

import EngineComponent from '../../engine/src/index';

const title = 'App';

class AppComponent extends Component {
    engineProps = {
        viewWidth: 800,
        viewHeight: 800,
        cellWidth: 8,
        cellHeight: 8
    }

    render() {
        return (
            <Provider store={store}>
                <h2>{title}</h2>
                <EngineComponent 
                    viewWidth={this.engineProps.viewWidth} 
                    viewHeight={this.engineProps.viewHeight}
                    cellWidth={this.engineProps.cellWidth}
                    cellHeight={this.engineProps.cellHeight} />
            </Provider>
        );
    }
}

ReactDOM.render(
    <AppComponent />,
    document.getElementById('root')
);