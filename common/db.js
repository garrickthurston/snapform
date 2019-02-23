const sql = require('mssql');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

var parts = config.connection_string.split(';');
var dbConfig = {
    connectionString: config.connection_string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    port: 1433,
    options: {
        encrypt: true
    }
};
parts.forEach(part => {
    var items = part.split('=');
    switch (items[0]) {
        case 'User ID':
            dbConfig.user = items[1];
            break;
        case 'Password':
            dbConfig.password = items[1];
            break;
        case 'Data Source':
            dbConfig.server = items[1];
            break;
        case 'Initial Catalog':
        case 'Database':
            dbConfig.database = items[1];
            break;
    }
});

const pool = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('== DB POOL CONNECTED ==');
        return pool;
    })
    .catch(err => {
        console.log('== DB POOL CONNECTION FAILED ==');
        console.log(err);
    });

module.exports = {
    sql,
    pool,
    execute: (query, params = null) => new Promise(async (resolve, reject) => {
        try {
            if (!params) {
                params = [];
            }
            
            var ps = new sql.PreparedStatement(await pool);
            var source = {};
            params.forEach((item) => {
                if (item.name && item.type) {
                    ps.input(item.name, item.type);
                    source[item.name] = item.value !== undefined ? item.value : null;
                }
            });
            
            ps.prepare(query, (err) => {
                if (err) {
                    return reject(err);
                }
    
                ps.execute(source, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
    
                    ps.unprepare((err) => {
                        if (err) {
                            return reject(err);
                        }
    
                        resolve(result);
                    });
                });
            });
    
        } catch (e) {
            reject(e);
        }
    }),
    execute_sp: (query, params = null) => new Promise(async (resolve, reject) => {
        try {
            if (!params) {
                params = [];
            }
            var ps = new sql.Request(await db.pool);
            params.forEach((item) => {
                if (item.name && item.type) {
                    ps.input(item.name, item.type, item.value !== undefined ? item.value : null);
                }
            });
            let recordset = await ps.execute(query);
    
            resolve(recordset);
        } catch (e) {
            reject(e);
        }
    })
};