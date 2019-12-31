import jwt from 'jsonwebtoken';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

export const generateToken = (sub, incomingPayload) => {
    if (!incomingPayload) {
        incomingPayload = null;
    }

    const payload = {
        sub,
        iss: config.token_issuer,
        role: 'admin', // TODO
        data: incomingPayload
    };

    // 24 Hours
    const expIn = 3600 * 24 * 1000;
    const keepSignedIn = true; // TODO
    const options = {
        ...(keepSignedIn ? {} : { expiresIn: (expIn / 1000) })
    };

    return jwt.sign(payload, config.token_secret, options);
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};
