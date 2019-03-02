import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../../../common/config/redux/redux.store';

const mapStateToProps = (state) => state;

class TextAreaComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>TEXTAREA</div>
        );
    }
}

const TextArea = connect(mapStateToProps)(TextAreaComponent);
export default TextArea;