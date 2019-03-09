import React, { Component } from 'react';
import { store } from '../../../../common/config/redux/redux.store';
import { connect } from 'react-redux';
import { WorkspaceService } from '../../../../common/services/workspace.service';
import Loadable from 'react-loadable';

import LoadingComponent from '../../shared/loading.component';

const ProjectComponent = Loadable({
    loader: () => import('./project/project.component'),
    loading: LoadingComponent
});

import '../../../assets/style/internal/workspace/workspace.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

class WorkspaceComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};

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
    }

    render() {
        const { project_id, workspace_id } = this.state;
        
        return (
            <div className="workspace-container">
                { project_id && workspace_id 
                ? 
                <ProjectComponent 
                    workspace_id={workspace_id}
                    project_id={project_id} />
                : null }
            </div>
        );
    }
};

const Workspace = connect(mapStateToProps, mapDispatchToProps)(WorkspaceComponent);

export default Workspace;