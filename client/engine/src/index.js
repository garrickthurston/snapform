import React, { Component } from 'react';
import GridComponent from './components/grid.component';
import { Provider } from 'react-redux';
import { store } from './config/redux/redux.store';

import '../assets/style/index.scss';

class EngineComponent extends Component {
    render() {
        const { workspace_id, project } = this.props;
        return (
            <Provider store={store}>
                <div id="snapgrid">
                    <GridComponent 
                        workspace_id={workspace_id}
                        project={project} />
                </div>
            </Provider>
        );
    }
};

export default EngineComponent;