const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

const jwt = require('jsonwebtoken');


const decodeToken = (token) => {
    return jwt.decode(token);
};
const generateToken = (user_id) => {
    //TODO: add role to users table
    //TODO: add keep signed in

    const exp = 3600 * 1000;
    const now = new Date();
    const exp_date = new Date(now + exp);

    var token_obj = {
        sub: this._id,
        iss: config.token_issuer,
        role: 'admin',
        exp: Math.floor(exp_date.getTime() / 1000),
        user: user_id
    };
    
    var keep_signed_in = true;
    var options = {};
    if (!keep_signed_in) {
        options.expiresIn = exp / 1000;
    }

    return jwt.sign(token_obj, config.token_secret, options);
};

module.exports = {
    decodeToken,
    generateToken
};