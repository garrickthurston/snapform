import React, { Component } from 'react';
import { updateBGImage, updateToken } from '../config/redux/redux.actions';
import { store } from '../config/redux/redux.store';
import { connect } from 'react-redux';
import { http } from '../shared/common/http';
import { withRouter } from 'react-router-dom';
import { qs } from '../shared/common/qs';

import bg_1 from '../../assets/images/login-background-1.jpg';
import bg_2 from '../../assets/images/login-background-2.jpg';
import '../../../engine/assets/images/mgt-logo-2.png';
import '../../assets/style/internal/login.scss';

function mapDispatchToProps(dispatch) {
    return {
        updateBGImage: payload => dispatch(updateBGImage(payload)),
        updateToken: payload => dispatch(updateToken(payload))
    };
}

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.http = new http();
        this.qs = new qs();

        this.params = this.qs.parse(this.props.location.search);
        if (this.params && this.params.l && this.params.l === '1') {
            this.props.updateToken(null);
            this.props.history.push('/login');
        }
        
        this.state = {
            email: '',
            password: '',
            submitText: 'Submit',
            processing: false
        };

        const backgrounds = [bg_1, bg_2];
        const url = backgrounds[Math.floor(Math.random() * backgrounds.length)];

        this.props.updateBGImage(`url('${url}')`);

        this.login = this.login.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    async login(e) {
        try {
            e.preventDefault();

            this.setState({
                submitText: 'Processing...',
                processing: true
            });

            let response = await this.http.post('/api/v1/auth/authenticate', {
                email: this.state.email,
                password: this.state.password
            }, false);

            if (response) {
                this.props.updateToken(response.token);

                this.props.history.push('/dashboard');
            }
        } catch (e) {
            this.setState({
                submitText: 'Submit',
                processing: false
            });
        }
    }

    render() {
        const { backgroundImage } = store.getState();
        const { submitText, processing } = this.state;
        return (
            <div className="g-container">
                <div id="backgroundElement" className="bg" style={{ background: backgroundImage }}></div>
                <div className="g-landing">
                    <div className="g-landing-logo"></div>
                    <form className="g-login-form" onSubmit={this.login}>
                        <div className="g-login-form-input">
                            <input className="g-border-color g-valid" type="text" value={this.state.email} onChange={this.handleEmailChange} />
                            <span className="g-login-form-input-placeholder">Email</span>
                        </div>
                        <div className="g-login-form-input">
                            <input className="g-border-color g-valid" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                            <span className="g-login-form-input-placeholder">Password</span>
                        </div>
                        <div className="g-btn-holder">
                            <input className="g-btn" type="submit" value={submitText} disabled={processing} />
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

export default withRouter(Login);