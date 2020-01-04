import { executeQuery, dataTypes } from '../../../utils/dbUtils';
import { guid } from '../../../utils/encryptionUtils';
import ProjectDbService from './project.db.service';

export default function WorkspaceDbService() {
    this.projectDbService = new ProjectDbService();

    const _getUserWorkspaceConfig = async (userId) => {
        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: userId }
        ];

        const result = await executeQuery(_queries.getUserWorkspaceConfig, params);

        return result.recordset.length ? result.recordset[0] : null;
    };

    const _initiateWorkspace = async (userId) => {
        const workspaceId = guid();
        const projectId = guid();

        const workspace = {
            workspaceId,
            workspaceName: 'Untitled Workspace',
            config: { activeProjectId: projectId, activeProjectTabs: [projectId] },
            projects: [{
                projectId,
                projectName: 'Untitled Project',
                config: {},
                items: {}
            }]
        };

        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: userId },
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspaceId },
            { name: 'workspace_name', type: dataTypes.NVarChar, value: workspace.workspaceName },
            { name: 'workspace_config', type: dataTypes.NVarChar, value: JSON.stringify(workspace.config) },
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: projectId },
            { name: 'project_name', type: dataTypes.NVarChar, value: workspace.projects[0].projectName },
            { name: 'project_config', type: dataTypes.NVarChar, value: JSON.stringify(workspace.projects[0].config) },
            { name: 'items', type: dataTypes.NVarChar, value: JSON.stringify(workspace.projects[0].items) }
        ];

        await executeQuery(_queries.initiateWorkspace, params);
    };

    const _groupAllWorkspaceProjects = async (projects) => {
        const workspaceIds = [];
        projects.forEach((item) => {
            if (workspaceIds.indexOf(item.workspaceId) === -1) { workspaceIds.push(item.workspaceId); }
        });
        const activeProjectIds = [];
        workspaceIds.forEach((item) => {
            const project = projects.find(x => item === x.workspaceId);
            const config = JSON.parse(project.config);
            activeProjectIds.push(config.activeProjectId);
        });

        let [...activeProjects] = await Promise.all(activeProjectIds.map((activeProjectId) => this.projectDbService.getProject(activeProjectId)));
        activeProjects = [
            ...activeProjects.filter((item) => !!item)
        ];

        const results = [];
        projects.forEach((item) => {
            const workspaceActiveProject = activeProjects.find(x => x.workspaceId === item.workspaceId);
            const project = {
                ...item,
                workspaceConfig: JSON.parse(item.config),
                ...(workspaceActiveProject && item.projectId === workspaceActiveProject.projectId ? workspaceActiveProject : {})
            };

            const workspace = results.find(x => x.workspaceId.toLowerCase() === project.workspaceId.toLowerCase());
            if (workspace) {
                workspace.projects.push({
                    projectId: project.projectId,
                    projectName: project.projectName,
                    ...(project.config ? { config: project.config } : {}),
                    ...(project.items ? { items: project.items } : {})
                });
            } else {
                results.push({
                    workspaceId: project.workspaceId,
                    workspaceName: project.workspaceName,
                    config: project.workspaceConfig,
                    projects: [{
                        projectId: project.projectId,
                        projectName: project.projectName,
                        ...(project.config ? { config: project.config } : {}),
                        ...(project.items ? { items: project.items } : {})
                    }]
                });
            }
        });

        return results;
    };

    this.getAllUserWorkspaces = async (userId) => {
        if (!userId) {
            throw new Error('Unauthorized');
        }

        let userWorkspaceConfig = await _getUserWorkspaceConfig(userId);

        const params = [
            { name: 'user_id', type: dataTypes.UniqueIdentifier, value: userId }
        ];

        let result = await executeQuery(_queries.getAllUserWorkspaces, params);
        if (!result.recordset.length) {
            await _initiateWorkspace(userId);
            userWorkspaceConfig = await _getUserWorkspaceConfig(userId);

            result = await executeQuery(_queries.getAllUserWorkspaces, params);
        }

        const results = await _groupAllWorkspaceProjects(result.recordset, userWorkspaceConfig.activeWorkspaceId);

        return {
            config: userWorkspaceConfig,
            results
        };
    };

    this.initiateUserWorkspace = async (userId) => {
        if (!userId) {
            throw new Error('Unauthorized');
        }

        await _initiateWorkspace(userId);

        return this.getAllUserWorkspaces(userId);
    };

    this.getWorkspace =  async (workspaceId) => {
        const params = [
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspaceId }
        ];

        const result = await executeQuery(_queries.getWorkspace, params);

        return result.recordset.length ? {
            ...result.recordset[0],
            config: JSON.parse(result.recordset[0].config)
        } : null;
    };

    this.updateWorkspace = async (workspace) => {
        const params = [
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspace.workspaceId },
            { name: 'config', type: dataTypes.NVarChar, value: JSON.stringify(workspace.config) },
            { name: 'workspace_name', type: dataTypes.NVarChar, value: workspace.workspaceName }
        ];

        await executeQuery(_queries.updateWorkspace, params);

        return this.getWorkspace(workspace.workspaceId);
    };
}

const _queries = {
    getUserWorkspaceConfig: `
        SELECT
            wc.active_workspace_id AS activeWorkspaceId
        FROM [app].[user_workspace_config] wc
        WHERE wc.user_id = @user_id
    `,
    initiateWorkspace: `
        DECLARE @needs_config BIT = (
            SELECT CASE WHEN count(*) > 0 THEN 0 ELSE 1 END
            FROM [app].[user_workspace_config]
            WHERE user_id = @user_id
        )

        IF @needs_config = 1
        BEGIN
            INSERT [app].[user_workspace_config] (user_id, active_workspace_id)
            VALUES (@user_id, NULL)
        END

        INSERT INTO [app].[workspace] (
            [workspace_id],
            [user_id],
            [workspace_name],
            [config]
        ) VALUES (
            @workspace_id,
            @user_id,
            @workspace_name,
            @workspace_config
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
            @project_config,
            @items
        )
    
        UPDATE [app].[user_workspace_config]
        SET active_workspace_id = @workspace_id
        WHERE user_id = @user_id
    `,
    getAllUserWorkspaces: `
        SELECT w.workspace_id AS workspaceId,
                w.workspace_name AS workspaceName,
                w.config AS config,
                p.project_id AS projectId,
                p.project_name AS projectName
        FROM [app].[workspace] w
        JOIN [app].[project] p ON w.workspace_id = p.workspace_id
        WHERE w.user_id = @user_id
    `,
    getWorkspace: `
        SELECT w.workspace_id AS workspaceId,
                w.user_id AS userId,
                w.config AS config,
                w.workspace_name AS workspaceName
        FROM [app].[workspace] w
        WHERE w.workspace_id = @workspace_id
    `,
    updateWorkspace: `
        UPDATE [app].[workspace]
        SET config = @config,
            workspace_name = @workspace_name
        WHERE workspace_id = @workspace_id
    `
};
