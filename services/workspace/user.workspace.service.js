const env = process.env.NODE_ENV || 'development';
const config = require('../../config/env.' + env);
const uuid = require('uuid');

const db = require('../../common/db');
const queries = require('../../sql/app_code/services/workspace/user.workspace.service');
const defaults = require('../../common/defaults');

const getAll = (user_id) => new Promise(async (resolve, reject) => {
    try {
        const params = [
            { name: 'user_id', type: db.sql.UniqueIdentifier, value: user_id }
        ];

        let result = await db.execute(queries.getAll, params);

        if (!result || !result.recordset) {
            // TODO
            throw new Error('Error');
        }

        if (!result.recordset.length) {
            await post(user_id, null);

            return resolve(getAll(user_id));
        }

        resolve(result.recordset);
    } catch (e) {
        reject(e);
    }
});
const get = (user_id, workspace_id) => new Promise(async (resolve, reject) => {
    try {
        const params = [
            { name: 'user_id', type: db.sql.UniqueIdentifier, value: user_id },
            { name: 'workspace_id', type: db.sql.UniqueIdentifier, value: workspace_id }
        ];

        let result = await db.execute(queries.get, params);

        if (!result || !result.recordset) {
            // TODO
            throw new Error('Error');
        }

        var obj;
        if (result.recordset.length) {
            obj = {
                workspace_id: result.recordset[0].workspace_id,
                projects: result.recordset.map(item => item.project_id) 
            };
        }

        resolve(obj || []);
    } catch (e) {
        reject(e);
    }
});
const post = (user_id, workspace) => new Promise(async (resolve, reject) => {
    try {
        if (!workspace) {
            workspace = {
                project: {
                    project_id: uuid(),
                    config: defaults.workspace.project.config,
                    items: {}
                }
            }
        }

        if (!workspace.id) {
            workspace.id = uuid();
        }

        const params = [
            { name: 'user_id', type: db.sql.UniqueIdentifier, value: user_id },
            { name: 'workspace_id', type: db.sql.UniqueIdentifier, value: workspace.id },
            { name: 'project_id', type: db.sql.UniqueIdentifier, value: workspace.project.project_id },
            { name: 'config', type: db.sql.NVarChar, value: JSON.stringify(workspace.project.config) },
            { name: 'items', type: db.sql.NVarChar, value: JSON.stringify(workspace.project.items) }
        ];

        await db.execute(queries.post, params);

        resolve();
    } catch (e) {
        reject(e);
    }
});

module.exports = {
    getAll,
    get,
    post
};