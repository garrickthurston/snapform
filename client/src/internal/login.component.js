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
            password: '' ,
            emailInputClassName: 'g-border-color',
            passwordInputClassName: 'g-border-color'
        };

        const backgrounds = [bg_1, bg_2];
        const url = backgrounds[Math.floor(Math.random() * backgrounds.length)];

        this.props.updateBGImage(`url('${url}')`);

        this.login = this.login.bind(this);
        this.handleInputClassName = this.handleInputClassName.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    login(e) {
        e.preventDefault();
    }

    handleInputClassName(field) {
        var name = 'g-border-color';
        switch (field) {
            case 'email':
                name += !!this.state.email && this.state.email.length ? ' g-valid' : '';
                this.setState({emailInputClassName: name});
                return;
            case 'password':
                name += !!this.state.password && this.state.password.length ? ' g-valid': '';
                this.setState({passwordInputClassName: name});
                return;
        }
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});

        this.handleInputClassName('email');
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});

        this.handleInputClassName('password');
    }
    render() {
        const { backgroundImage } = store.getState();
        const { emailInputClassName, passwordInputClassName } = this.state;
        return (
            <div className="g-container">
                <div id="backgroundElement" className="bg" style={{ background: backgroundImage }}></div>
                <div id="backgroundElementShade" className="shade"></div>
                <div className="g-landing">
                    <div className="g-landing-logo"></div>
                    <form className="g-login-form" onSubmit={this.login}>
                        <div className="g-login-form-input">
                            <input className={emailInputClassName} type="text" value={this.state.email} onChange={this.handleEmailChange} />
                            <span className="g-login-form-input-placeholder">Email</span>
                        </div>
                        <div className="g-login-form-input">
                            <input className={passwordInputClassName} type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                            <span className="g-login-form-input-placeholder">Password</span>
                        </div>
                        <div className="g-btn-holder">
                            <input className="g-btn" type="submit" value="Submit" />
                        </div>
                        {/* <input type="submit" [ngClass]="{'o-btn--dark': processing}" class="t-btn o-btn o-btn--maxinternal o-btn__dashboard--active o-btn--setheight" value="Login" [disabled]="!loginForm.valid || processing">  */}
                        {/* <div class="c-login__forgot_container">
                            <a class="c-login__forgot" routerLink="/forgotpassword">Forgot Password?</a>
                            <h5 style="color: red;">{{messages}}</h5>
                        </div> */}
                    </form>
                </div>
            </div>
        );
    }
}

const Login = connect(null, mapDispatchToProps)(LoginComponent);

export default Login;