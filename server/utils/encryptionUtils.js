import crypto from 'crypto';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

export const hashString = (string) => {
    const { encryption_secret } = config;

    return crypto.createHmac('sha256', encryption_secret).update(string).digest('hex');
};
