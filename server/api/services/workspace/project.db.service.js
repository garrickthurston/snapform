import { executeQuery, dataTypes } from '../../../utils/dbUtils';

export default function ProjectDbService() {
    this.getProject = async (workspaceId, projectId) => {
        const params = [
            { name: 'workspace_id', type: dataTypes.UniqueIdentifier, value: workspaceId },
            { name: 'project_id', type: dataTypes.UniqueIdentifier, value: projectId }
        ];

        const result = await executeQuery(_queries.getProject, params);
        if (result.recordset.length) {
            const project = result.recordset[0];
            return {
                ...project,
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
            { name: 'project_name', type: dataTypes.NVarChar, value: project.project_name },
            { name: 'config', type: dataTypes.NVarChar, value: JSON.stringify(project.config) },
            { name: 'items', type: dataTypes.NVarChar, value: JSON.stringify(project.items) }
        ];

        await executeQuery(_queries.updateProject, params);

        return this.getProject(workspaceId, projectId);
    };
};

const _queries = {
    getProject: `
        SELECT p.*
        FROM [app].[project] p
        JOIN [app].[workspace] w ON p.workspace_id = w.workspace_id
        WHERE w.workspace_id = @workspace_id AND p.project_id = @project_id
    `,
    updateProject: `
        UPDATE p
        SET p.project_name = @project_name,
            p.config = @config,
            p.items = @items
        FROM [app].[project] p
        WHERE p.workspace_id = @workspace_id AND p.project_id = @project_id
    `
};