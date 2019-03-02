module.exports = {
    getAll: `
        SELECT ww.workspace_id
        FROM workspace.workspace ww
        JOIN workspace.user_workspace wuw ON ww.workspace_id = wuw.workspace_id
        WHERE wuw.user_id = @user_id
    `,
    get: `
        SELECT ww.workspace_id, wp.project_id
        FROM workspace.workspace ww
        JOIN workspace.user_workspace wuw ON ww.workspace_id = wuw.workspace_id
        JOIN workspace.project wp ON ww.project_id = wp.project_id
        WHERE wuw.workspace_id = @workspace_id AND wuw.user_id = @user_id
    `,
    post: `
        BEGIN TRANSACTION

            INSERT INTO workspace.project (
                [project_id],
                [config],
                [items]
            ) VALUES (
                @project_id,
                @config,
                @items
            )

            INSERT INTO workspace.workspace (
                [workspace_id],
                [project_id]
            ) VALUES (
                @workspace_id,
                @project_id
            )

            INSERT INTO workspace.user_workspace (
                [user_id],
                [workspace_id]
            ) VALUES (
                @user_id,
                @workspace_id
            )

        COMMIT TRANSACTION
    `
};