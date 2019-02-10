import React, { Component } from 'react';
import GridComponent from './components/grid.component';

import '../assets/style/index.scss'

class EngineComponent extends Component {

    render() {
        return (
            <div id="snapgrid">
                <GridComponent width={this.props.width} height={this.props.height} />
            </div>
        );
    }
};

export default EngineComponent;