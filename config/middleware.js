const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
const cors = require('cors');

module.exports = (app) => {
    
    // webpack
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    // enable cors
    app.use(cors());

    return {};
};