import express from 'express';
import http from 'http';
import routes from './api/framework/routes';

const port = process.env.PORT || 81;
const app = express();
const server = http.createServer(app);

app.use(express.static('../client/dist'));

routes.register(app);

server.listen(port, () => {
    console.log(`PORT :: ${port}`);
});
