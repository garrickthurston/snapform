import React, { Component } from 'react';
import { store } from '../config/redux/redux.store';
import { updateViewSettings } from '../config/redux/redux.actions';
import { connect } from 'react-redux';

import EngineComponent from '../../../engine/src/index';

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

        const payload = {
            viewWidth: 800,
            viewHeight: 550,
            cellWidth: 8,
            cellHeight: 8,
            project_name: 'form_1'
        };
        this.props.updateViewSettings(payload);
    }

    render() {
        const { viewWidth, viewHeight, cellWidth, cellHeight, project_name } = store.getState();
        return (
            <div className="d-container">
                <h2><span className="user-icon"></span>Dashboard</h2>
                <EngineComponent 
                    project_name={project_name}
                    viewWidth={viewWidth} 
                    viewHeight={viewHeight}
                    cellWidth={cellWidth}
                    cellHeight={cellHeight} />
            </div>
        );
    }
};

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);

export default Dashboard;