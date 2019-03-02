import React, { Component } from 'react';
import { store } from '../../../common/config/redux/redux.store';
import { updateViewSettings } from '../config/redux/redux.actions';
import { connect } from 'react-redux';
import { WorkspaceService } from '../../../common/services/workspace.service';
import Loadable from 'react-loadable';

import LoadingComponent from '../shared/loading.component';

const EngineComponent = Loadable({
    loader: () => import ('../../../engine/src/index'),
    loading: LoadingComponent
});

import '../../assets/style/internal/dashboard.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        updateViewSettings: payload => dispatch(updateViewSettings(payload))
    };
}

class DashboardComponent extends Component {
    constructor(props) {
        super(props);

        this.workspaceService = new WorkspaceService();

        this.state = {};
        
        // TODO
        this.workspaceService.getAll().then(workspaces => {
            return this.workspaceService.get(workspaces[0].workspace_id);
        }).then(workspace => {
            this.setState(Object.assign({}, this.state, {
                workspace_id: workspace.workspace_id,
                project_id: workspace.projects[0], // TODO
                project_name: workspace.projects[0] // TODO
            }))

            // TODO: REMOVE view settings from here and not pass as props - originate in engine component
            const payload = {
                viewWidth: 800,
                viewHeight: 550,
                cellWidth: 8,
                cellHeight: 8
            };
            this.props.updateViewSettings(payload);
        }).catch(e => {

        });        
    }

    render() {
        const { viewWidth, viewHeight, cellWidth, cellHeight } = store.getState().appReducer;
        const { project_name, project_id, workspace_id } = this.state;
        
        return (
            <div className="d-container">
                <h2><span className="user-icon"></span>Dashboard</h2>
                { project_id && workspace_id 
                ? 
                <EngineComponent 
                    workspace_id={workspace_id}
                    project_id={project_id}
                    project_name={project_name}
                    viewWidth={viewWidth} 
                    viewHeight={viewHeight}
                    cellWidth={cellWidth}
                    cellHeight={cellHeight} />
                : null }
            </div>
        );
    }
};

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);

export default Dashboard;