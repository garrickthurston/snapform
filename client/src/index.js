import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EngineComponent from '../../engine/src/index';

const title = 'App';

class AppComponent extends Component {
    engineProps = {
        width: 800,
        height: 1200
    };

    render() {
        return (
            <div>
                <h2>{title}</h2>
                <EngineComponent width={this.engineProps.width} height={this.engineProps.height} />
            </div>
        );
    }
}

ReactDOM.render(
    <AppComponent width="800" height="1200" />,
    document.getElementById('root')
);