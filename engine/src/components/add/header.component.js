import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';
import { addInputValueChanged } from '../../config/redux/redux.actions';

import HeaderSizeComponent from './header-size.component';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        addInputValueChanged: payload => dispatch(addInputValueChanged(payload))
    };
}

class HeaderComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerText: '',
            inputClassName: 'g-border-color',
            dropdownClassName: 'btn dropdown-toggle shadow-none',
            headerSizes: [
                'h6', 'h5', 'h4', 'h3', 'h2', 'h1'
            ]
        };

        this.handleHeaderTextChange = this.handleHeaderTextChange.bind(this);
    }

    handleHeaderTextChange(e) {
        var inputClassName = 'g-border-color';
        var dropdownClassName = 'btn dropdown-toggle shadow-none';
        if (e.target.value && e.target.value.length) {
            inputClassName += ' g-valid';
            dropdownClassName += ' g-valid';
        }
        this.setState(Object.assign({}, this.state, {
            inputClassName: inputClassName,
            dropdownClassName: dropdownClassName,
            headerText: e.target.value
        }));

        this.props.addInputValueChanged(e.target.value);
    }

    render() {
        const { inputClassName, dropdownClassName, headerSizes } = this.state;
        const { addInputTag } = store.getState();

        var headerSize = (<h6>{this.state.headerText}</h6>);
        if (addInputTag) {
            switch (addInputTag) {
                case 'h1':
                    headerSize = (<h1>{this.state.headerText}</h1>);
                    break;
                case 'h2':
                    headerSize = (<h2>{this.state.headerText}</h2>);
                    break;
                case 'h3':
                    headerSize = (<h3>{this.state.headerText}</h3>);
                    break;
                case 'h4':
                    headerSize = (<h4>{this.state.headerText}</h4>);
                    break;
                case 'h5':
                    headerSize = (<h5>{this.state.headerText}</h5>);
                    break;
                case 'h6':
                    headerSize = (<h6>{this.state.headerText}</h6>);
                    break;
            }
        }
        return (
            <div>
                <div className="input-component">
                    <input className={inputClassName} type="text" value={this.state.headerText} onChange={this.handleHeaderTextChange} />
                    <span className="g-login-form-input-placeholder">Header Text</span>
                </div>
                <div className={this.state.headerText && this.state.headerText.length ? 'input-component show-dropdown' : 'input-component hide-dropdown'}>
                    <div className="dropdown">
                        <button className={dropdownClassName} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {headerSize}
                        </button>
                        <span>Header Size</span>
                        <div className="dropdown-menu">
                            {headerSizes.map((header, i) => {
                                return (<HeaderSizeComponent key={header} headerKey={header} headerText={this.state.headerText} />);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export default Header;