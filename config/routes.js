const env = process.env.NODE_ENV || 'development';
const config = require('./env.' + env);

const middleware = require('./middleware');

module.exports = (app) => {
    //register middleware
    const mw = middleware(app);

    // provide application index
	app.get('/', function (req, res) {
		res.sendFile('index.html', {root: './dist/'});
    });
    
    return {};
};