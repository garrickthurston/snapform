const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const prodConfig = () => merge([{
    mode: 'production',
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    },
    plugins: [new OptimizeCssAssetsPlugin()]
}]);

module.exports = env => merge(baseConfig(env), prodConfig());
