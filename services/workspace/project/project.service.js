const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/env.' + env);

const db = require('../../../common/db');
const queries = require('../../../sql/app_code/services/workspace/project/project.service.sql');
const defaults = require('../../../common/defaults');

const get = (project_id) => new Promise(async (resolve, reject) => {
    try {
        const params = [
            { name: 'project_id', type: db.sql.UniqueIdentifier, value: project_id }
        ];

        let result = await db.execute(queries.get, params);

        if (!result || !result.recordset) {
            // TODO
            throw new Error('Error');
        }

        var record = result.recordset.length ? result.recordset[0] : {};
        if (record.items && record.config) {
            record.items = JSON.parse(record.items);
            record.config = JSON.parse(record.config);
            record.config = Object.assign({}, defaults.workspace.project.config, record.config);
        }

        resolve(record);
    } catch (e) {
        reject(e);
    }
});
const put = (project_id, items, config) => new Promise(async (resolve, reject) => {
    try {
        const params = [
            { name: 'project_id', type: db.sql.UniqueIdentifier, value: project_id },
            { name: 'items', type: db.sql.NVarChar, value: JSON.stringify(items) },
            { name: 'config', type: db.sql.NVarChar, value: JSON.stringify(config) }
        ];

        await db.execute(queries.put, params);

        resolve();
    } catch (e) {
        reject(e);
    }
});

module.exports = {
    get,
    put
};