const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const prodConfig = () => merge([{
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                }
            })
        ]
    },
    plugins: [new OptimizeCssAssetsPlugin()]
}]);

module.exports = env => merge(baseConfig(env), prodConfig());
