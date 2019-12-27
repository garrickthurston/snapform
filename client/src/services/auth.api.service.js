import api from '../utils/api';

async function authenticateUser(username, password) {
    const { token } = await api.post('auth', { username, password });

    if (token) {
        api.setToken(token);
    }

    return api.decodeToken();
}

function unauthenticateUser() {
    api.clearToken();
    api.clearUser();
}

function getUser() {
    return api.decodeToken();
}

export default {
    authenticateUser,
    unauthenticateUser,
    getUser
};
