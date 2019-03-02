import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

class DocsComponent extends Component {
    render() {
        return (
            <div>
                <h2>Docs</h2>
            </div>
        );
    }
};

const Docs = connect(mapStateToProps)(DocsComponent);

export default Docs;