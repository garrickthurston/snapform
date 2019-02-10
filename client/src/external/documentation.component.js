import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

class DocumentationComponent extends Component {
    render() {
        return (
            <div>
                <h2>Documentation</h2>
            </div>
        );
    }
};

const Documentation = connect(mapStateToProps)(DocumentationComponent);

export default Documentation;