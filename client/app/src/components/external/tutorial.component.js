import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';

const mapStateToProps = (state) => state;

class TutorialComponent extends Component {
    render() {
        return (
            <div>
                <h2>Tutorial</h2>
            </div>
        );
    }
};

const Tutorial = connect(mapStateToProps)(TutorialComponent);

export default Tutorial;