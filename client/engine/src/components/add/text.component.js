import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';
import { updateProjectConfig } from '../../config/redux/redux.actions';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
    return {
        updateProjectConfig: payload => dispatch(updateProjectConfig(payload))
    };
};

class TextComponent extends Component {
    defaultClassName = 'g-border-color';

    constructor(props) {
        super(props);

        this.state = {
            inputFieldName: '',
            inputClassName: this.defaultClassName
        };

        this.handleInputFieldNameChanged = this.handleInputFieldNameChanged.bind(this);
    }

    handleInputFieldNameChanged(e) {
        this.setState(Object.assign({}, this.state, {
            inputFieldName: e.target.value,
            inputClassName: this.defaultClassName + (e.target.value && e.target.value.length ? ' g-valid' : '')
        }));

        const { workspace } = store.getState();
        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.config.ui, {
                add: Object.assign({}, workspace.project.config.ui.add, {
                    value: e.target.value
                })
            })
        }));
    }

    render() {
        const { inputClassName } = this.state;

        return (
            <div className="input-component">
                <input className={inputClassName} type="text" value={this.state.inputFieldName} onChange={this.handleInputFieldNameChanged} />
                <span className="g-login-form-input-placeholder">Field Name</span>
            </div>
        );
    }
}

const Text = connect(mapStateToProps, mapDispatchToProps)(TextComponent);

export default Text;