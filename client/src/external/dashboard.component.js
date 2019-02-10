import React, { Component } from 'react';
import store from '../config/redux/redux.store';
import { updateViewSettings } from '../config/redux/redux.actions';
import { connect } from 'react-redux';

import EngineComponent from '../../../engine/src/index';

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
            viewHeight :800,
            cellWidth: 8,
            cellHeight: 8
        };
        this.props.updateViewSettings(payload);
    }

    render() {
        const { viewWidth, viewHeight, cellWidth, cellHeight } = store.getState();
        return (
            <div>
                <h2>Dashboard</h2>
                <EngineComponent 
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