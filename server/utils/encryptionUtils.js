import crypto from 'crypto';
const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

export const hashString = (string) => {
    if (!string) {
        throw new Error('Must provide string to encrypt')
    }

    return crypto.createHmac('sha256', config.encryption_secret).update(string).digest('hex');
};

export const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

export const isGuid = (str) => {
    const regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
    const match = regex.exec(str);
    return match !== null;
};
