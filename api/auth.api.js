const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

const auth = require('../services/auth/auth.service');

module.exports = () => {
    return {
        hashPassword: async (req, res) => {
            try {
                const password = req.body.password;

                let hash = await auth.hashPassword(password);

                res.status(200).json({ hash });
            } catch (e) {
                res.status(500).json({
                    error: 'Error Hashing Password'
                })
            }
        },
        updatePassword: async (req, res) => {
            try {
                const password = req.body.password;

                await auth.updatePassword(password);

                res.status(200).json({ 
                    'status': 'Updated Password'    
                });
            } catch (e) {
                res.status(500).json({
                    //error: 'Error Updating Password'
                    error: e
                })
            }
        },
    };
};