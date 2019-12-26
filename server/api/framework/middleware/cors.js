import cors from 'cors';

// TODO - pull into app config
const _domainWhitelist = [
    'localhost:*',
    '*.ngrok.io'
];

export default {
    register: (app) => {
        app.use(cors());

        const checkOrigin = (origin, callback) => {
            const { host } = origin.headers;

            let allowed = false;
            for (let i = 0; i < _domainWhitelist.length; i++) {
                let item = _domainWhitelist[i];
                item = item.replace('*', '');
                allowed = !host || (item !== 'localhost:' ? host.endsWith(item) : host.startsWith(item));
                if (allowed) { break; }
            }

            if (allowed) {
                callback(null, true);
                return;
            }

            callback(new Error('Not Allowed by CORS'));
        };

        return cors(checkOrigin);
    }
};
