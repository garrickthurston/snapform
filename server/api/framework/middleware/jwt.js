import jwt from 'express-jwt';

const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/env.' + env);

export default {
    register: (app) => jwt({
        issuer: config.token_issuer,
        secret: config.token_secret,
        requestProperty: 'payload'
    })
};
