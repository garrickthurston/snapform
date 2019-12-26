import middleware from './middleware';
import AuthController from '../controllers/auth';
import UserWorkspaceController from '../controllers/workspace/user.workspace';

const routes = {
    register: (app) => {
        const { cors, validToken } = middleware.register(app);

        // routes
        app.post('/api/v1/auth', cors, (new AuthController()).authenticateUser);
        app.put('/api/v1/auth', cors, (new AuthController()).updatePassword);

        app.get('/api/v1/workspaces', cors, validToken, (new UserWorkspaceController()).getAllUserWorkspaces);
        app.post('/api/v1/workspaces', cors, validToken, (new UserWorkspaceController()).postUserWorkspace);
        app.get('/api/v1/workspaces/:workspaceId', cors, validToken, (new UserWorkspaceController()).getUserWorkspace);

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
