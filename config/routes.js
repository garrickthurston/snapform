const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

const cors = require('cors');
const middleware = require('./middleware');
const postware = require('./postware');

const Auth = require('../api/auth.api')();

module.exports = (app) => {
    //register middleware
    const mw = middleware(app);

    // provide application index
	app.get('/', function (req, res) {
		res.sendFile('index.html', {root: './dist/'});
    });

    // Auth
    app.get('/api/v1/auth/hashpassword', /*mw.validToken,*/ cors(mw.corsOrigin), Auth.hashPassword);
    app.post('/api/v1/auth/updatepassword', /*mw.validToken,*/ cors(mw.corsOrigin), Auth.updatePassword);
    
    postware(app);
};