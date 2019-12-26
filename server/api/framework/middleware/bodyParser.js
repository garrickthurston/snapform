import bodyParser from 'body-parser';

export default {
    register: (app) => {
        app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
        app.use(bodyParser.json({ limit: '5mb' }));
    }
};
