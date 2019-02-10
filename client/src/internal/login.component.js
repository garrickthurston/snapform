import React, { Component} from 'react';
import { updateBGImage } from '../config/redux/redux.actions';
import store from '../config/redux/redux.store';
import { connect } from 'react-redux';

import bg_1 from '../../assets/images/login-background-1.jpg';
import bg_2 from '../../assets/images/login-background-2.jpg';
import '../../../engine/assets/images/mgt-logo-2.png';
import '../../assets/style/internal/login.scss';

function mapDispatchToProps(dispatch) {
    return {
        updateBGImage: payload => dispatch(updateBGImage(payload))
    };
}

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '' ,
            emailInputClassName: 'g-border-color'
        };

        const backgrounds = [bg_1, bg_2];
        const url = backgrounds[Math.floor(Math.random() * backgrounds.length)];

        this.props.updateBGImage(`url('${url}')`);

        this.login = this.login.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.handleInputClassName = this.handleInputClassName.bind(this);
    }

    login() {

    }

    emailChange(e) {
        this.setState({email: e.target.value});

        this.handleInputClassName('email');
    }

    handleInputClassName(field) {
        var name = 'g-border-color';
        switch (field) {
            case 'email':
                name += !!this.state.email ? ' g-valid' : '';
                break;
        }

        this.setState({emailInputClassName: name});
    }

    render() {
        const { backgroundImage } = store.getState();
        const className = this.state.emailInputClassName;
        return (
            <div className="g-container">
                <div id="backgroundElement" className="bg" style={{ background: backgroundImage }}></div>
                <div id="backgroundElementShade" className="shade"></div>
                <div className="g-landing">
                    <div className="g-landing-logo"></div>
                    <form className="g-login-form" onSubmit={this.login()}>
                        <div className="g-login-form-input">
                            <input className={className} type="text" value={this.state.email} onChange={this.emailChange} />
                            <span className="g-login-form-input-placeholder">Email</span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const Login = connect(null, mapDispatchToProps)(LoginComponent);

export default Login;