import crypto from 'crypto';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

export const hashString = (string) => {
    if (!string) {
        throw new Error('Must provide string to encrypt')
    }

    const { encryption_secret } = config;

    return crypto.createHmac('sha256', encryption_secret).update(string).digest('hex');
};

export const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
