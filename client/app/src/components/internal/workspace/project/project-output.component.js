import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../../../config/redux/redux.store';
import { syntaxHighlight } from '../../../../shared/utils/json-syntax';

import { ProjectService } from '../../../../services/workspace/project/project.service';

const mapStateToProps = (state) => state;

class ProjectOutputComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.projectService = new ProjectService();

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);

        this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
            this.setState(Object.assign({}, this.state, {
                project
            }));
        }).catch(e => {

        });
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false)
    }

    handleOutsideClick(e) {
        if (this.output.contains(e.target)) {
            return;
        }

        this.props.onClose();
    }

    handleCloseClick(e) {
        this.props.onClose();
    }

    render() {
        const { project } = this.state;

        return (
            <div>
                {project ?
                <div ref={output => this.output = output} className="project-output-container">
                    <div className="close-icon-container" onClick={this.handleCloseClick}>
                        <span className="close-icon"></span>
                    </div>
                    <pre dangerouslySetInnerHTML={{
                        __html: syntaxHighlight(JSON.stringify(project, null, 2))
                    }}></pre>
                </div>
                : null}
            </div>
        );
    }
}

const ProjectOutput = connect(mapStateToProps, null)(ProjectOutputComponent);
export default ProjectOutput;