import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../../contexts/providers/UserContextProvider';
import TextInput from '../../core/TextInput';
import Button from '../../core/Button';
import uiStrings from '../../../ui-strings';
import './LoginForm.scss';

export default function LoginForm() {
    const user = useUser();
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [disableBtn, setDisableBtn] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const onUsernameChange = (event, { newValue }) => setUsername(newValue);
    const onPasswordChange = (event, { newValue }) => setPassword(newValue);

    const submitLogin = useCallback(async (event) => {
        event.preventDefault();
        event.stopPropagation();

        setErrorMessage(null);
        setDisableBtn(true);

        try {
            await user.actions.authenticateUser(username, password);

            history.push('/workspace');
        } catch (e) {
            setDisableBtn(false);
            setErrorMessage(uiStrings.invalidUsernameOrPassword);
        }
    }, [user, username, password, history]);

    return (
        <form className="login-form" onSubmit={submitLogin}>
            <TextInput
                placeholder="Username"
                value={username}
                onChange={onUsernameChange}
            />
            <TextInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={onPasswordChange}
            />
            <Button
                type="submit"
                disabled={disableBtn || !username.length || !password.length}
            >
                <span>Submit</span>
            </Button>
            <div className="error-message-container">
                <span>{errorMessage}</span>
            </div>
        </form>
    );
}
