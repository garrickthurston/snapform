import express from 'express';

export default {
    provideClient: (app) => {
        app.use(express.static('../client/dist'));
    },
    provideClientIndex: (app) => {
        app.get('/*', function (req, res) {
            res.sendFile('index.html', { root: '../client/dist/' });
        });
    }
};
