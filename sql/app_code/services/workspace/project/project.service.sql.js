module.exports = {
    get: `
        SELECT project_id, config, items
        FROM workspace.project
        WHERE project_id = @project_id
    `,
    put: `
        UPDATE workspace.project
        SET config = @config, items = @items
        WHERE project_id = @project_id
    `
};