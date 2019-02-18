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
        const { project } = store.getState();
        const item = project[this.props.project_path];

        return (
            <div>{JSON.stringify(item)}</div>
        );
    }
}

const ProjectOutput = connect(mapStateToProps)(ProjectOutputComponent);

export default ProjectOutput;