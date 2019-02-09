const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

const cors = require('cors');

module.exports = (app) => {
    app.use(cors());

    return {};
};