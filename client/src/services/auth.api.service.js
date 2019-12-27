import api from '../utils/api';
import { decodeToken } from '../utils/tokenUtils';

async function authenticateUser(username, password) {
    const { token } = await api.post('auth', { username, password });

    let user = null;
    if (token) {
        api.setToken(token);

        user = decodeToken(token);
        api.setUser(user);
    }

    return user;
}

function unauthenticateUser() {
    api.clearToken();
    api.clearUser();
}

function getUser() {
    return api.getUser();
}

export default {
    authenticateUser,
    unauthenticateUser,
    getUser
};
