import morgan from 'morgan';

export default {
    register: (app) => app.use(morgan(':method :status :url :res[content-length] B - :response-time ms'))
};
