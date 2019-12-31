import { executeQuery, dataTypes } from '../../../utils/dbUtils';
import { guid } from '../../../utils/encryptionUtils';

export default function UserWorkspaceDbService() {
    this.getAllUserWorkspaces = async (userId) => {
        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: userId }
        ];

        const result = await executeQuery(_queries.getAllUserWorkspaces, params);

        const results = [];
        result.recordset.forEach((item) => {
            const workspace = results.find(x => x.workspaceId === item.workspace_id);
            if (workspace) {
                workspace.project.push({
                    projectId: item.project_id,
                    projectName: item.project_name
                });
            } else {
                results.push({
                    workspaceId: item.workspace_id,
                    workspaceName: item.workspace_name,
                    projects: [{
                        projectId: item.project_id,
                        projectName: item.project_name
                    }]
                });
            }
        });

        return results;
    };

    this.initiateUserWorkspace = async (userId, workspace) => {
        if (!userId) {
            throw new Error('Unauthorized');
        }

        if (!workspace || !workspace.project) {
            workspace = {
                project: {
                    project_id: guid(),
                    project_name: 'Untitled Project',
                    config: {},
                    items: {}
                }
            };
        }

        if (!workspace.id) {
            workspace = {
                ...workspace,
                workspace_id: guid(),
                workspace_name: 'Untitled Workspace'                
            };
        }

        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: userId },
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspace.workspace_id },
            { name: 'workspace_name', type: dataTypes.NVarChar, value: workspace.workspace_name },
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: workspace.project.project_id },
            { name: 'project_name', type: dataTypes.NVarChar, value: workspace.project.project_name },
            { name: 'config', type: dataTypes.NVarChar, value: JSON.stringify(workspace.project.config) },
            { name: 'items', type: dataTypes.NVarChar, value: JSON.stringify(workspace.project.items) }
        ];

        await executeQuery(_queries.initiateUserWorkspace, params);

        return this.getUserWorkspace(userId, workspace.workspace_id);
    };

    this.getUserWorkspace = async (user_id, workspace_id) => {
        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: user_id },
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspace_id }
        ];

        const result = await executeQuery(_queries.getUserWorkspace, params);
        if (result.recordset.length) {
            const results = [];
            result.recordset.forEach((item) => {
                const workspace = results.find(x => x.workspaceId === item.workspace_id);
                if (workspace) {
                    workspace.project.push({
                        projectId: item.project_id,
                        projectName: item.project_name
                    });
                } else {
                    results.push({
                        workspaceId: item.workspace_id,
                        workspaceName: item.workspace_name,
                        projects: [{
                            projectId: item.project_id,
                            projectName: item.project_name
                        }]
                    });
                }
            });
            
            return results[0];
        }

        return {};
    };
};

const _queries = {
    getAllUserWorkspaces: `
        SELECT w.workspace_id,
                w.workspace_name,
                p.project_id,
                p.project_name
        FROM [app].[workspace] w
        JOIN [app].[project] p ON w.workspace_id = p.workspace_id
        WHERE w.user_id = @user_id
    `,
    getUserWorkspace: `
        SELECT w.workspace_id,
            w.workspace_name,
            p.project_id,
            p.project_name
        FROM [app].[workspace] w
        JOIN [app].[project] p ON w.workspace_id = p.workspace_id
        WHERE w.user_id = @user_id AND w.workspace_id = @workspace_id
    `,
    initiateUserWorkspace: `
        INSERT INTO [app].[workspace] (
            [workspace_id],
            [user_id],
            [workspace_name]
        ) VALUES (
            @workspace_id,
            @user_id,
            @workspace_name
        )

        INSERT INTO [app].[project] (
            [project_id],
            [workspace_id],
            [project_name],
            [config],
            [items]
        ) VALUES (
            @project_id,
            @workspace_id,
            @project_name,
            @config,
            @items
        )
    `
};
