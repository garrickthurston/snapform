const sql = require('mssql');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

var parts = config.connection_string.split(';');
var dbConfig = {
    connectionString: config.connection_string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
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
    pool
};