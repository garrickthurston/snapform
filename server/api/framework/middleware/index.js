import morgan from './morgan';
import origin from './cors';
import jwt from './jwt';
import bodyParser from './bodyParser';

export default {
    register: (app) => {
        morgan.register(app);

        const cors = origin.register(app);
        const validToken = jwt.register();

        bodyParser.register(app);

        return {
            cors,
            validToken
        };
    }
};
