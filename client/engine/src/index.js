import React, { Component } from 'react';
import GridComponent from './components/grid.component';
import { Provider } from 'react-redux';
import { store } from '../../common/config/redux/redux.store';

import '../assets/style/index.scss';

class EngineComponent extends Component {
    render() {
        return (
            <Provider store={store}>
                <div id="snapgrid">
                    <GridComponent 
                        workspace_id={this.props.workspace_id}
                        project_id={this.props.project_id}
                        project_name={this.props.project_name}
                        viewWidth={this.props.viewWidth} 
                        viewHeight={this.props.viewHeight}
                        cellWidth={this.props.cellWidth}
                        cellHeight={this.props.cellHeight} />
                </div>
            </Provider>
        );
    }
};

export default EngineComponent;