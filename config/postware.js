const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

module.exports = (app) => {
    
    // default error handling
    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(err.status).send({
                error:err.message
            });
            return;
        }
        next();
    });
};