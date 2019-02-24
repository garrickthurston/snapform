const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/env.' + env);

module.exports = () => {
    return {
        updateProject: async (req, res) => {
            try {
                res.status(200).json({});
            } catch (e) {
                res.status(500).json({});
            }
        }
    };
};