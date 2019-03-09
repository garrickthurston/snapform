import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../../../common/config/redux/redux.store';
import { updateProjectConfig } from '../../config/redux/redux.actions';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        updateProjectConfig: payload => dispatch(updateProjectConfig(payload))
    };
}

class HeaderSizeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.handleHeaderSizeClick = this.handleHeaderSizeClick.bind(this);
    }

    handleHeaderSizeClick() {
        const { workspace } = store.getState().engineReducer;
        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.config.ui, {
                add: Object.assign({}, workspace.project.config.ui.add, {
                    tag: this.props.headerKey,
                })
            })
        }));
    }

    render() {
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;

        var headerSize = null;
        switch (this.props.headerKey) {
            case 'h1':
                headerSize = (<h1>{project.config.ui.add.value}</h1>);
                break;
            case 'h2':
                headerSize = (<h2>{project.config.ui.add.value}</h2>);
                break;
            case 'h3':
                headerSize = (<h3>{project.config.ui.add.value}</h3>);
                break;
            case 'h4':
                headerSize = (<h4>{project.config.ui.add.value}</h4>);
                break;
            case 'h5':
                headerSize = (<h5>{project.config.ui.add.value}</h5>);
                break;
            case 'h6':
                headerSize = (<h6>{project.config.ui.add.value}</h6>);
                break;
        }
        return (
            <a className="dropdown-item" onClick={this.handleHeaderSizeClick} >
                {headerSize}
            </a>
        );
    }
}

const HeaderSize = connect(mapStateToProps, mapDispatchToProps)(HeaderSizeComponent);

export default HeaderSize;