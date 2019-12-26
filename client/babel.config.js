module.exports = {
    presets: ['@babel/env', '@babel/react'],
    env: {
        test: {
            plugins: [
                'istanbul',
                'dynamic-import-node',
                ['babel-plugin-webpack-alias', { config: './webpack.base.config.js' }]
            ]
        }
    },
    plugins: [
        '@babel/syntax-dynamic-import',
        '@babel/proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-modules-umd',
        ['add-module-exports', { addDefaultProperty: true }]
    ]
};
