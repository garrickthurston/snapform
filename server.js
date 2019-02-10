const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';
const config = require('./config/env.' + env);

const express = require('express');
const app = express();
const http = require('http').createServer(app);

require('./common/database-pool');


app.use(express.static('./dist'));

require('./config/routes')(app);

http.listen(port, () => {
    console.log(`PORT :: ${port}`);
});