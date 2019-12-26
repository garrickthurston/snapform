const resolve = require('./webpack.common.resolve');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = () => merge([{
    entry: {
        main: ['@babel/polyfill', './src/index.js']
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        sourcePrefix: ''
    },
    module: {
        rules: [{
            test: /(?<!partner)\.s?[ac]ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: process.env.NODE_ENV === 'development'
                    }
                },
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        },
        {
            enforce: 'pre',
            test: /\.jsx?/,
            exclude: [
                /(node_modules)/,
                path.resolve(__dirname, 'js')
            ],
            loader: 'eslint-loader',
            options: {
                emitError: true
            }
        },
        {
            type: 'javascript/auto',
            test: /\.jsx?/,
            exclude: [
                /(node_modules)/
            ],
            use: ['babel-loader']
        },
        {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        fallback: 'file-loader',
                        name: '[name][md5:hash].[ext]',
                        outputPath: 'assets/',
                        publicPath: '/assets/'
                    }
                }
            ]
        },
        {
            test: /\.ico$/,
            loader: 'file-loader?name=[name].[ext]'
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], { verbose: false }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            favicon: 'assets/favicon.ico',
            template: 'src/index.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    resolveLoader: {
        moduleExtensions: ['-loader'],
        modules: [
            'node_modules'
        ]
    },
    resolve,
    devtool: 'source-map'
}]);
