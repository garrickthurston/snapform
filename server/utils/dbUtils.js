const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

import mssql from 'mssql';

function DatabasePool() {
    this.sql = mssql;
};
DatabasePool.prototype.pool = () => new mssql.ConnectionPool(config.connection_string)
    .connect()
    .then(pool => {
        console.log('=== DB POOL CONNECTED ===');
        return pool;
    })
    .catch(error => {
        console.log('=== DB POOL CONNECTION FAILED ===')
        console.log(error);
    });

let pool;
const getPool = async () => {
    if (!pool) {
        pool = await (new DatabasePool()).pool();
    }

    return pool;
};

// TODO - add default transaction wrapper
export const executeQuery = async (query, params = null) => {
    if (!params) { params = []; }
    const ps = new mssql.PreparedStatement(await getPool());

    try {
        const source = {};
        params.map(param => {
            if (param.name && param.type) {
                ps.input(param.name, param.type);
                source[param.name] = param.value || null;
            }
        });

        await ps.prepare(query);
        const result = await ps.execute(source);

        return result;
    } catch (e) {
        if (ps) {
            try {
                await ps.unprepare();
            } catch (ex) {
                console.log(ex);
            }
        }

        console.log(e);
    }
};

export const executeSproc = async (sproc, params = null) => {
    if (!params) { params = []; }
    const ps = new mssql.Request(await getPool());

    try {
        params.map(param => {
            if (param.name && param.type) {
                ps.input(param.name, param.type);
            }
        });

        const result = await ps.execute(source);

        return result;
    } catch (e) {
        if (ps && ps.unprepare) {
            try {
                await ps.unprepare();
            } catch (ex) {
                console.log(ex);
            }
        }

        console.log(e);
    }
};

export const types = mssql;
