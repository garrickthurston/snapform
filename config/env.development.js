const config = require('./.config.json');

module.exports = {
    connection_string: config.connection_string,
    token_issuer: config.token_issuer,
    token_secret: config.token_secret
};