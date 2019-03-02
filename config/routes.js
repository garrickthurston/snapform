const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

const cors = require('cors');
const middleware = require('./middleware');

const Auth = require('../api/auth.api')();
const Workspace = require('../api/workspace/user.workspace.api')();
const Project = require('../api/workspace/project/project.api')();

module.exports = (app) => {
    //register middleware
    const mw = middleware(app);

    // Auth
    app.get('/api/v1/auth/hashpassword', cors(mw.corsOrigin), Auth.hashPassword);
    app.post('/api/v1/auth/updatepassword', cors(mw.corsOrigin), Auth.updatePassword);
    app.post('/api/v1/auth/authenticate', cors(mw.corsOrigin), Auth.authenticate);
    
    //Workspace
    app.get('/api/v1/workspace', mw.validToken, cors(mw.corsOrigin), Workspace.getAll);
    app.get('/api/v1/workspace/:workspace_id', mw.validToken, cors(mw.corsOrigin), Workspace.get);
    app.post('/api/v1/workspace', mw.validToken, cors(mw.corsOrigin), Workspace.post);

    app.get('/api/v1/workspace/:workspace_id/project/:project_id', mw.validToken, cors(mw.corsOrigin), Project.get);
    app.put('/api/v1/workspace/:workspace_id/project/:project_id', mw.validToken, cors(mw.corsOrigin), Project.put);

    // provide application index
	app.get('/*', function (req, res) {
		res.sendFile('index.html', {root: './dist/'});
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
};