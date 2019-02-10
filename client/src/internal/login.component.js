import React, { Component} from 'react';
import { updateBGImage } from '../config/redux/redux.actions';
import store from '../config/redux/redux.store';
import { connect } from 'react-redux';

import bg_1 from '../../assets/images/login-background-1.jpg';
import bg_2 from '../../assets/images/login-background-2.jpg';
import '../../assets/style/internal/login.scss';

function mapDispatchToProps(dispatch) {
    return {
        updateBGImage: payload => dispatch(updateBGImage(payload))
    };
}

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        const backgrounds = [bg_1, bg_2];
        const url = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        
        this.props.updateBGImage(`url('${url}')`);
    }

    render() {
        const { backgroundImage } = store.getState();
        return (
            <div className="g-container">
                {/* <div class="c-main__loader"></div> */}
                <div id="backgroundElement" className="bg" style={{ background: backgroundImage }}></div>
                <div id="backgroundElementShade" className="shade"></div>
            </div>
        );
    }
}

const Login = connect(null, mapDispatchToProps)(LoginComponent);

export default Login;