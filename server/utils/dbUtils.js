import mssql from 'mssql';
const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

let pool;
const getPool = async () => {
    if (!pool) {
        try {
            pool = await (new mssql.ConnectionPool(config.connection_string)).connect();
            console.log('=== DB POOL CONNECTED ===');
        } catch (e) {
            console.log('=== DB POOL CONNECTION FAILED ===')
            console.log(e);
        }
    }

    return pool;
};

// TODO - add default transaction wrapper
export const executeQuery = async (query, params = null) => {
    if (!params) { params = []; }
    const ps = new mssql.PreparedStatement(await getPool());

    let e;
    let result;
    try {
        const source = {};
        params.map(param => {
            if (param.name && param.type) {
                ps.input(param.name, param.type);
                source[param.name] = param.value || null;
            }
        });

        await ps.prepare(query);
        result = await ps.execute(source);
    } catch (err) {
        e = err;
        console.log(e);
    } finally {
        if (ps && ps.unprepare) {
            await ps.unprepare();
        }
    }

    if (e) {
        throw e;
    }

    return result;
};

export const executeSproc = async (sproc, params = null) => {
    if (!params) { params = []; }
    const ps = new mssql.Request(await getPool());

    let e;
    let result;
    try {
        params.map(param => {
            if (param.name && param.type) {
                ps.input(param.name, param.type);
            }
        });

        result = await ps.execute(sproc);
    } catch (err) {
        e = err;
        console.log(e);
    } finally {
        if (ps && ps.unprepare) {
            await ps.unprepare();
        }
    }

    if (e) {
        throw e;
    }

    return result;
};

export const dataTypes = mssql;
