const path = require('path');

module.exports = {
    alias: {

    },
    extensions: ['.js', '.jsx', '.css', '.scss', '.png'],
    modules: [
        path.resolve(__dirname, 'src'),
        'node_modules'
    ]
};
