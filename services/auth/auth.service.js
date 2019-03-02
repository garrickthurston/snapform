const env = process.env.NODE_ENV || 'development';
const config = require('../../config/env.' + env);

const db = require('../../common/db');
const queries = require('../../sql/app_code/services/auth/auth.service.sql');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const hashCompare = (pass, hash) => new Promise((resolve, reject) => {
    try {
        bcrypt.compare(pass, hash, (err, result) => {
            resolve(result);
        });
    } catch (e) {
        reject(e);
    }
});
const getLocalStategy = () => new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' 
}, async (email, password, done) => {
    try {
        const params = [
            { name: 'email', type: db.sql.VarChar, value: email }
        ];

        let result = await db.execute(queries.authenticateQuery, params);

        if (!result || !result.recordset || !result.recordset.length) {
            throw new Error('Invalid Username or Password');
        }

        const user = result.recordset[0];
        let is_valid = await hashCompare(password, user.passhash);

        if (is_valid) {
            return done(null, {
                userID: user.user_id,
                userName: user.email
            });
        }

        return done(null, null, {
            message: 'Invalid Email or Password'
        });
    } catch (e) {
        return done(e, null, {
            message: 'Invalid Email or Password'
        });
    }
});

/* public */
const hashPassword = (password) => new Promise(async (resolve, reject) => {
    try {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                return reject(err);
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }

                resolve(hash);
            });
        });
    } catch (e) {
        reject(e);
    }
});
const updatePassword = (password) => new Promise(async (resolve, reject) => {
    try {
        let hash = await hashPassword(password);
        
        const params = [
            { name: 'passhash', type: db.sql.VarChar, value: hash }
        ];

        let result = await db.execute(queries.updatePasswordQuery, params);        

        if (!result.rowsAffected) {
            throw new Error('User Not Found');
        } 

        resolve();
    } catch (e) {
        reject(e);
    }
});
const authenticate = (req, res) => new Promise(async (resolve, reject) => {
    try {
        passport.authenticate('local', async (err, user, info) => {
            if (err) {
                return reject(err);
            }

            if (user) {
                user.user_id = user.userID;
                delete user.userID;
                
                return resolve(user);
            }

            reject(info);
        })(req, res);
    } catch (e) {
        reject(e);
    }
});

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const params = [
                { name: 'email', type: db.sql.VarChar, value: email }
            ];

            let result = await db.execute(queries.authenticateQuery, params);

            if (!result || !result.recordset || !result.recordset.length) {
                throw new Error('Invalid Email or Password');
            }

            done(null, result.recordset[0]);
        } catch (e) {
            done(e, null);
        }
    });

    let localStrategy = getLocalStategy();

    passport.use(localStrategy);

    return {
        hashPassword,
        updatePassword,
        authenticate
    };
};