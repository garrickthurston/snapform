import React, { useState, useCallback } from 'react';
import TextInput from '../../core/TextInput';
import Button from '../../core/Button';
import { useUser } from '../../../contexts/providers/UserContextProvider';
import './LoginComponent.scss';

export default function LoginComponent() {
    const user = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [disableBtn, setDisableBtn] = useState(false);
    const onUsernameChange = (event, { newValue }) => setUsername(newValue);
    const onPasswordChange = (event, { newValue }) => setPassword(newValue);

    const submitLogin = useCallback(async (event) => {
        event.preventDefault();

        setDisableBtn(true);

        try {
            await user.actions.authenticateUser(username, password);
        } finally {
            setDisableBtn(false);
        }
    }, [user, username, password]);

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
        </form>
    );
}
