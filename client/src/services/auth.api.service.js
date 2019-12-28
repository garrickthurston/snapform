import api from '../utils/api';

function getUser() {
    return api.decodeToken();
}

async function authenticateUser(username, password) {
    const { token } = await api.post('auth', { username, password });

    if (token) {
        api.setToken(token);
    }

    return getUser();
}

function unauthenticateUser() {
    api.clearToken();
}

export default {
    authenticateUser,
    unauthenticateUser,
    getUser
};
