const env = process.env.NODE_ENV || 'development';
const config = require('../../config/env.' + env);

const userWorkspace = require('../../services/workspace/user.workspace.service');

module.exports = () => {
    return {
        getAll: async (req, res) => {
            try {
                const user_id = req.payload.user_id;

                if (!user_id) {
                    return res.status(400).json({});
                }

                let results = await userWorkspace.getAll(user_id);

                res.status(200).json(results);
            } catch (e) {
                res.status(500).json({});
            }
        },
        get: async (req, res) => {
            try {
                const user_id = req.payload.user_id;
                const workspace_id = req.params.workspace_id;

                if (!user_id || !workspace_id) {
                    return res.status(400).json({});
                }

                let result = await userWorkspace.get(user_id, workspace_id);

                res.status(200).json(result);
            } catch (e) {
                res.status(500).json({});
            }
        },
        post: async (req, res) => {
            try {
                const user_id = req.payload.user_id;
                let workspace = req.body.workspace;

                if (!user_id) {
                    return res.status(400).json({});
                }

                await userWorkspace.post(user_id, workspace);

                res.status(200).json({});
            } catch (e) {
                res.status(500).json({});
            }
        },
    }
}