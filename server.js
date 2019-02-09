const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';
const config = require('./config/env.' + env);

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');


app.use(express.static('./public'));

app.use(cors());
require('./config/routes')(app);

http.listen(port, () => {
    console.log(`PORT :: ${port}`);
});