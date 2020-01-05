import { executeQuery, dataTypes } from '../../../utils/dbUtils';
import { guid } from '../../../utils/encryptionUtils';

export default function ProjectDbService() {
    this.getProject = async (projectId) => {
        const params = [
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: projectId }
        ];

        const result = await executeQuery(_queries.getProject, params);
        if (result.recordset.length) {
            const { project_id, project_name, workspace_id, ...project } = result.recordset[0];
            return {
                projectId: project_id,
                projectName: project_name,
                workspaceId: workspace_id,
                ...(project.config ? { config: JSON.parse(project.config) } : {}),
                ...(project.items ? { items: JSON.parse(project.items) } : {})
            };
        }

        return null;
    };

    this.updateProject = async (workspaceId, projectId, project) => {
        const params = [
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspaceId },
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: projectId },
            { name: 'project_name', type: dataTypes.NVarChar, value: project.projectName },
            { name: 'config', type: dataTypes.NVarChar, value: JSON.stringify(project.config) },
            { name: 'items', type: dataTypes.NVarChar, value: JSON.stringify(project.items) }
        ];

        await executeQuery(_queries.updateProject, params);

        return this.getProject(projectId);
    };

    this.initiateProject = async (workspaceId, projectName) => {
        const project = {
            project_id: guid(),
            project_name: projectName || 'Untitled Project',
            config: {},
            items: {}
        };
        
        const params = [
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspaceId },
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: project.project_id },
            { name: 'project_name', type: dataTypes.NVarChar, value: project.project_name },
            { name: 'config', type: dataTypes.NVarChar, value: JSON.stringify(project.config) },
            { name: 'items', type: dataTypes.NVarChar, value: JSON.stringify(project.items) }
        ];

        await executeQuery(_queries.insertProject, params);

        return this.getProject(project.project_id);
    };

    this.deleteProject = async (userId, workspaceId, projectId) => {
        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: userId },
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspaceId },
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: projectId }
        ];

        await executeQuery(_queries.deleteProject, params);
    };
};

const _queries = {
    getProject: `
        SELECT p.*
        FROM [app].[project] p
        JOIN [app].[workspace] w ON p.workspace_id = w.workspace_id
        WHERE p.project_id = @project_id
    `,
    updateProject: `
        UPDATE p
        SET p.project_name = @project_name,
            p.config = @config,
            p.items = @items
        FROM [app].[project] p
        WHERE p.workspace_id = @workspace_id AND p.project_id = @project_id
    `,
    insertProject: `
        INSERT [app].[project] (project_id, workspace_id, project_name, config, items)
        VALUES (@project_id, @workspace_id, @project_name, @config, @items)
    `,
    deleteProject: `
        DELETE [app].[project]
        WHERE project_id = @project_id

        DECLARE @project_count int = (SELECT count(*) FROM [app].[project] WHERE workspace_id = @workspace_id)
        IF (@project_count = 0)
        BEGIN
            DECLARE @active_workspace_id uniqueidentifier = (SELECT active_workspace_id FROM [app].[user_workspace_config] WHERE user_id = @user_id)
            IF @active_workspace_id = @workspace_id
            BEGIN
                DECLARE @workspace_count int = (SELECT count(*) FROM [app].[workspace] WHERE user_id = @user_id)
                IF @workspace_count > 1
                BEGIN
                    UPDATE [app].[user_workspace_config]
                    SET active_workspace_id = (
                        SELECT TOP 1 workspace_id
                        FROM [app].[workspace]
                        WHERE user_id = @user_id AND workspace_id <> @workspace_id
                    )
                    WHERE user_id = @user_id
                END
                ELSE
                BEGIN
                    DELETE [app].[user_workspace_config]
                    WHERE user_id = @user_id
                END

            END

            DELETE [app].[workspace]
            WHERE workspace_id = @workspace_id
        END
    `
};
