import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../config/redux/redux.store';

const mapStateToProps = (state) => state;

class ProjectOutputComponent extends Component {
    constructor(props) {
        super(props);

        this.state ={

        };
    }

    render() {
        const { workspace } = store.getState();
        const project = workspace.project;

        return (
            <div>{JSON.stringify(project.items)}</div>
        );
    }
}

const ProjectOutput = connect(mapStateToProps)(ProjectOutputComponent);

export default ProjectOutput;