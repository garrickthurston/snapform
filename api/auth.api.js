const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

const auth = require('../services/auth/auth.service')();
const jwt = require('../common/jwt');

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
                });
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
                });
            }
        },
        authenticate: async (req, res) => {
            const email = req.body.email;
			const password = req.body.password;
            try {
                if (!email || !email.length || !password || !password.length) {
					return res.status(500).json({
                        //error: errors.authentication.error_authenticateMessage
                        error: 'User or Password Not Provided'
					});
                }
                
                // passport uses the req body to pull email/hash
                let user = await auth.authenticate(req, res);
                
                const token = jwt.generateToken(user.user_id);

                res.status(200).json({
                    token
                });

            } catch (e) {
                res.status(401).json({
                    message: e && e.message ? e.message : 'Invalid Username or Password'
                });
            }
        }
    };
};