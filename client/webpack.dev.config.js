const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const devConfig = () => merge([{
    mode: 'development',
    devServer: {
        port: 5000,
        open: true,
        contentBase: './dist',
        hot: true,
        proxy: {
            '/': 'http://localhost:81'
        },
        writeToDisk: true,
        overlay: true
    },
    stats: {
        colors: true
    }
}]);

module.exports = env => merge(baseConfig(env), devConfig());
