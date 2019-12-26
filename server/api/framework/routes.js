import middleware from './middleware';
import AuthController from '../controllers/auth';

const routes = {
    register: (app) => {
        const { cors, validToken } = middleware.register(app);

        // routes
        app.get('/api/v1/auth/hash', cors, (new AuthController()).hashMessage);

        // provide application index
        app.get('/*', function (req, res) {
            res.sendFile('index.html', { root: '../client/dist/' });
        });

        //default error handler
        app.use((err, req, res, next) => {
            if (err) {
                res.status(err.status).send({
                    error: err.message
                });
                return;
            }

            next();
        });
    }
};

export default routes;