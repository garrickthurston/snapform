import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';
import { addInputTagChanged } from '../../config/redux/redux.actions';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        addInputTagChanged: payload => dispatch(addInputTagChanged(payload))
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
        this.props.addInputTagChanged(this.props.headerKey);
    }

    render() {
        const { addInputValue } = store.getState();

        var headerSize = null;
        switch (this.props.headerKey) {
            case 'h1':
                headerSize = (<h1>{addInputValue}</h1>);
                break;
            case 'h2':
                headerSize = (<h2>{addInputValue}</h2>);
                break;
            case 'h3':
                headerSize = (<h3>{addInputValue}</h3>);
                break;
            case 'h4':
                headerSize = (<h4>{addInputValue}</h4>);
                break;
            case 'h5':
                headerSize = (<h5>{addInputValue}</h5>);
                break;
            case 'h6':
                headerSize = (<h6>{addInputValue}</h6>);
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