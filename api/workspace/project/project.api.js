const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/env.' + env);

const project = require('../../../services/workspace/project/project.service');

module.exports = () => {
    return {
        get: async (req, res) => {
            try {
                const project_id = req.params.project_id;
                
                if (!project_id) {
                    return res.status(400).json({});
                }

                let result = await project.get(project_id);

                res.status(200).json(result);
            } catch (e) {
                res.status(500).json({});
            }
        },
        put: async (req, res) => {
            try {
                const project_id = req.params.project_id;
                const config = req.body.config;
                const items = req.body.items;

                if (!project_id || !config || !items) {
                    return res.status(400).json({});
                }

                await project.put(project_id, items, config);

                res.status(200).json({});
            } catch (e) {
                res.status(500).json({});
            }
        }
    };
};