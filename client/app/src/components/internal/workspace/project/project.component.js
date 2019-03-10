import React, { Component } from 'react';
import { store } from '../../../../config/redux/redux.store';
import { connect } from 'react-redux';
import { ProjectService } from '../../../../services/workspace/project/project.service';
import Loadable from 'react-loadable';

import LoadingComponent from '../../../../shared/components/loading.component';

const EngineComponent = Loadable({
    loader: () => import ('../../../../../../engine/src/index'),
    loading: LoadingComponent
});
const ProjectOutputComponent = Loadable({
    loader: () => import ('./project-output.component'),
    loading: LoadingComponent
});

import '../../../../../assets/style/internal/workspace/project/project.scss';

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

        this.handleProjectUpdate = this.handleProjectUpdate.bind(this);
        this.handleDebugIconClick = this.handleDebugIconClick.bind(this);
    }

    componentDidMount() {
        this.project.addEventListener('sf.workspace.project.update', this.handleProjectUpdate, false);
    }

    componentWillUnmount() {
        this.project.removeEventListener('sf.workspace.project.update', this.handleProjectUpdate, false);
    }

    async handleProjectUpdate(e) {
        const { workspace_id, project } = e.detail;

        try {
            await this.projectService.put(workspace_id, project.project_id, project);
        } catch (e) {

        }
    }

    handleDebugIconClick() {

    }

    render() {
        const { workspace_id } = this.props;
        const { project } = this.state;
        const { user } = store.getState();
        
        return (
            <div className="project-container" ref={project => this.project = project}>
                { project ?
                <div className="engine-container">
                    <EngineComponent 
                        workspace_id={workspace_id}
                        project={project} />
                </div>
                : null }
            </div>
        );
    }
};

const Project = connect(mapStateToProps, mapDispatchToProps)(ProjectComponent);

export default Project;