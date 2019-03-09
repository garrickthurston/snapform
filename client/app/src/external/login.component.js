import React, { Component } from 'react';
import { updateToken } from '../config/redux/redux.actions';
import { store } from '../config/redux/redux.store';
import { connect } from 'react-redux';
import { Http } from '../shared/utils/http';
import { withRouter } from 'react-router-dom';
import { Qs } from '../shared/utils/qs';

import bg_1 from '../../assets/images/login-background-1.jpg';
import bg_2 from '../../assets/images/login-background-2.jpg';
import '../../assets/images/mgt-logo-2.png';
import '../../assets/style/external/login.scss';

const mapDispatchToProps = (dispatch) => {
    return {
        updateToken: payload => dispatch(updateToken(payload))
    };
}

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.http = new Http();
        this.qs = new Qs();

        this.params = this.qs.parse(this.props.location.search);
        if (this.params && this.params.l && this.params.l === '1') {
            this.props.updateToken(null);
            this.props.history.push('/login');
        }

        const backgrounds = [bg_1, bg_2];
        const url = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        
        this.state = {
            email: '',
            password: '',
            submitText: 'Submit',
            processing: false,
            bgImage: `url('${url}')`
        };

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

                this.props.history.push('/workspace');
            }
        } catch (e) {
            this.setState({
                submitText: 'Submit',
                processing: false
            });
        }
    }

    render() {
        const { submitText, processing, bgImage } = this.state;

        return (
            <div className="g-container">
                <div id="backgroundElement" className="bg" style={{ background: bgImage }}></div>
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