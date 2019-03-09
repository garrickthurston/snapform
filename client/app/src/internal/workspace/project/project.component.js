import React, { Component } from 'react';
import { store } from '../../../../../common/config/redux/redux.store';
import { connect } from 'react-redux';
import { ProjectService } from '../../../../../common/services/project.service';
import Loadable from 'react-loadable';

import LoadingComponent from '../../../shared/loading.component';

const EngineComponent = Loadable({
    loader: () => import ('../../../../../engine/src/index'),
    loading: LoadingComponent
});

import '../../../../assets/style/internal/workspace/project/project.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

class ProjectComponent extends Component {
    constructor(props) {
        super(props);

        this.projectService = new ProjectService();

        this.state = {};

        this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
            this.setState(Object.assign({}, this.state, {
                project
            }));
        }).catch(e => {

        });
    }

    render() {
        const { workspace_id } = this.props;
        const { project } = this.state;
        
        return (
            <div className="project-container">
                <h2><span className="user-icon"></span>Workspace</h2>
                { project ?
                <EngineComponent 
                    workspace_id={workspace_id}
                    project={project} />
                : null }
            </div>
        );
    }
};

const Project = connect(mapStateToProps, mapDispatchToProps)(ProjectComponent);

export default Project;