import middleware from './middleware';
import AuthController from '../controllers/auth';
import UserWorkspaceController from '../controllers/workspace/user.workspace';
import ProjectController from '../controllers/workspace/project';

const routes = {
    register: (app) => {
        const { cors, validToken } = middleware.register(app);

        // routes
        app.post('/api/v1/auth', cors, (new AuthController()).authenticateUser);
        app.put('/api/v1/auth', cors, (new AuthController()).updatePassword);

        app.get('/api/v1/workspaces', cors, validToken, (new UserWorkspaceController()).getAllUserWorkspaces);
        app.post('/api/v1/workspaces', cors, validToken, (new UserWorkspaceController()).postUserWorkspace);
        app.get('/api/v1/workspaces/:workspaceId', cors, validToken, (new UserWorkspaceController()).getUserWorkspace);

        app.get('/api/v1/workspaces/:workspaceId/projects/:projectId', cors, validToken, (new ProjectController()).getProject);
        app.put('/api/v1/workspaces/:workspaceId/projects/:projectId', cors, validToken, (new ProjectController()).updateProject);

        middleware.provideClientIndex(app);

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
