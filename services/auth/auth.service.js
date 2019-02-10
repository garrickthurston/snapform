const env = process.env.NODE_ENV || 'development';
const config = require('../../config/env.' + env);

const db = require('../../common/db');
const authsql = require('../../sql/app_code/services/auth/auth.service.sql');

//const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

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

        let result = await db.execute(authsql.updatePassword, params);        

        if (!result.rowsAffected) {
            throw new Error('User Not Found');
        } 

        resolve();
    } catch (e) {
        reject(e);
    }
});

module.exports = {
    hashPassword,
    updatePassword
}