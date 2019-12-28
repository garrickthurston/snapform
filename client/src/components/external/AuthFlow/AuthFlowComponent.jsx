import React, { useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../../hooks/routeHooks';
import LoginComponent from './LoginComponent';
import { useUser } from '../../../contexts/providers/UserContextProvider';

import './AuthFlowComponent.scss';
import '../../../../assets/images/login-background-1.jpg';
import '../../../../assets/images/login-background-2.jpg';
import '../../../../assets/images/mgt-logo-2.png';

const _backgrounds = ['/assets/images/login-background-1.jpg', '/assets/images/login-background-2.jpg'];
const _displayComponents = {
    login: <LoginComponent />
};

export default function AuthFlowComponent({ display }) {
    const user = useUser();
    const queryParams = useQueryParams();
    const history = useHistory();

    useEffect(() => {
        if (user.data) {
            if (queryParams && queryParams.l === '1') {
                user.actions.unauthenticateUser();
                history.push('/login');
            }
        }
    }, [queryParams, user, user.data, history]);

    const renderDisplayComponent = useMemo(() => {
        if (_displayComponents[display]) {
            return _displayComponents[display];
        }

        return _displayComponents.login;
    }, [display]);

    const renderBackground = useMemo(() => {
        const bg = _backgrounds[Math.floor(Math.random() * _backgrounds.length)];

        return (<div id="background" className="bg" style={{ background: `url('${bg}')`, backgroundSize: 'cover' }} />);
    }, []);

    return (
        <div className="auth-flow-container">
            {renderBackground}
            <div className="flow-component">
                <div className="flow-logo" />
                {renderDisplayComponent}
            </div>
        </div>
    );
}
