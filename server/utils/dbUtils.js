const env = process.env.NODE_ENV || 'development';
const config = require('../config/env.' + env);

import mssql from 'mssql';

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
        console.log(e);
    } finally {
        if (ps && ps.unprepare) {
            await ps.unprepare();
        }
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
        console.log(e);
    } finally {
        if (ps && ps.unprepare) {
            await ps.unprepare();
        }
    }
};

export const dataTypes = mssql;
