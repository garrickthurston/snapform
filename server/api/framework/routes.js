import middleware from './middleware';
import AuthController from '../controllers/auth';
import WorkspaceController from '../controllers/workspace/workspace';
import ProjectController from '../controllers/workspace/project';

const routes = {
    register: (app) => {
        const { cors, validToken } = middleware.register(app);

        // routes
        app.post('/api/v1/auth', cors, (new AuthController()).authenticateUser);
        app.put('/api/v1/auth', cors, (new AuthController()).updatePassword);

        app.get('/api/v1/workspaces', cors, validToken, (new WorkspaceController()).getAllUserWorkspaces);
        app.post('/api/v1/workspaces', cors, validToken, (new WorkspaceController()).postUserWorkspace);
        app.put('/api/v1/workspaces/:workspaceId/config', cors, validToken, (new WorkspaceController()).updateWorkspaceConfig);

        app.post('/api/v1/workspaces/:workspaceId/projects', cors, validToken, (new ProjectController()).postProject);
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
