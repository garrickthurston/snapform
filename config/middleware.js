const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

const morgan = require('morgan');
const webpack = require('webpack');
const webpackConfig = require('../webpack.dev');
const compiler = webpack(webpackConfig);
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

module.exports = (app) => {
    app.use(morgan(':method :status :url :res[content-length] B - :response-time ms'));
    
    // webpack
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    // enable cors
    app.use(cors());
    const whitelist = [
        'localhost:*',
        '*.ngrok.io'
    ];
    const corsOrigin = {
        origin: (origin, callback) => {
            var allowed = false;
            for (var i = 0; i < whitelist.length; i++) {
                var item = whitelist[i];
                item = item.replace('*', '');
                allowed = !origin || (item !== 'localhost:' ? origin.endsWith(item) : origin.indexOf(item) > -1);
                if (allowed) {
                    break;
                }
            }
    
            if (allowed) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    }

    // jwt
    const validToken = jwt({
        issuer: config.token_issuer,
        secret: config.token_secret,
        requestProperty: 'payload'
    });

    // body parser
    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
    app.use(bodyParser.json({limit: '5mb'}));

    return {
        validToken,
        corsOrigin
    }
};