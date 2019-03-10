import React, { Component } from 'react';
import { store } from '../../../config/redux/redux.store';
import { connect } from 'react-redux';
import { WorkspaceService } from '../../../services/workspace/workspace.service';
import Loadable from 'react-loadable';

import LoadingComponent from '../../../shared/components/loading.component';

const ProjectComponent = Loadable({
    loader: () => import('./project/project.component'),
    loading: LoadingComponent
});
const ProjectOutputComponent = Loadable({
    loader: () => import('./project/project-output.component'),
    loading: LoadingComponent
});

import '../../../../assets/style/internal/workspace/workspace.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

class WorkspaceComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            debugWindowOpen: false
        };

        this.workspaceService = new WorkspaceService();

        // TODO
        this.workspaceService.getAll().then(workspaces => {
            return this.workspaceService.get(workspaces[0].workspace_id);
        }).then(workspace => {
            this.setState(Object.assign({}, this.state, {
                workspace_id: workspace.workspace_id,
                project_id: workspace.projects[0] // TODO
            }));
        }).catch(e => {

        });

        this.handleDebugIconClick = this.handleDebugIconClick.bind(this);
        this.handleDebugWindowClose = this.handleDebugWindowClose.bind(this);
    }

    handleDebugIconClick() {
        this.setState(Object.assign({}, this.state, {
            debugWindowOpen: true
        }));
    }

    handleDebugWindowClose() {
        this.setState(Object.assign({}, this.state, {
            debugWindowOpen: false
        }));
    }

    render() {
        const { project_id, workspace_id, debugWindowOpen } = this.state;
        const { user } = store.getState();

        return (
            <div className="workspace-container">
                { user.role === 'admin' ?
                <div className="debug-icon-container" onClick={this.handleDebugIconClick}>
                    <span className="debug-icon"></span>
                </div>
                : null }
                { project_id && workspace_id ? 
                <ProjectComponent 
                    workspace_id={workspace_id}
                    project_id={project_id} />
                : null }
                { debugWindowOpen ?
                <ProjectOutputComponent project_id={project_id} workspace_id={workspace_id} onClose={this.handleDebugWindowClose} />
                : null }
            </div>
        );
    }
};

const Workspace = connect(mapStateToProps, mapDispatchToProps)(WorkspaceComponent);

export default Workspace;