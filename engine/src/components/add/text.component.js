import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';

const mapStateToProps = (state) => state;

class TextComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>TEXT</div>
        );
    }
}

const Text = connect(mapStateToProps)(TextComponent);
export default Text;