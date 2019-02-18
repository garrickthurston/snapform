import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';

const mapStateToProps = (state) => state;

class HeaderComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerText: '',
            inputClassName: 'g-border-color'
        };

        this.handleHeaderTextChange = this.handleHeaderTextChange.bind(this);
    }

    handleHeaderTextChange(e) {
        var inputClassName = 'g-border-color'
        if (e.target.value && e.target.value.length) {
            inputClassName += ' g-valid';
        }
        this.setState(Object.assign({}, this.state, {
            inputClassName: inputClassName,
            headerText: e.target.value
        }));
    }

    render() {
        const { inputClassName } = this.state;
        return (
            <div className="input-component">
                <input className={inputClassName} type="text" value={this.state.headerText} onChange={this.handleHeaderTextChange} />
                <span className="g-login-form-input-placeholder">Header Text</span>
                <div className="g-errors-list">

                </div>
            </div>
        );
    }
}

const Header = connect(mapStateToProps)(HeaderComponent);
export default Header;