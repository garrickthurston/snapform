import ProjectDbService from '../../services/workspace/project.db.service';
import WorkspaceDbService from '../../services/workspace/workspace.db.service';

export default function ProjectController() {
    this.projectDbService = new ProjectDbService();
    this.workspaceDbService = new WorkspaceDbService();

    this.getProject = async (req, res) => {
        try {
            const { projectId } = req.params;

            const result = await this.projectDbService.getProject(projectId);

            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Retrieving Project',
                stack: e.stack
            });
        }
    };

    this.updateProject = async (req, res) => {
        try {
            const { workspaceId, projectId } = req.params;
            const { ...project } = req.body;

            const result = await this.projectDbService.updateProject(workspaceId, projectId, project);

            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Updating Project',
                stack: e.stack
            });
        }
    };

    this.postProject = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { projectName = null } = req.body || {};

            const result = await this.projectDbService.initiateProject(workspaceId, projectName);
            const workspace = await this.workspaceDbService.getWorkspace(workspaceId);
            await this.workspaceDbService.updateWorkspace({
                ...workspace,
                config: {
                    ...workspace.config,
                    activeProjectId: result.projectId,
                    activeProjectTabs: [
                        ...(workspace.config.activeProjectTabs || []),
                        result.projectId
                    ]
                }
            });

            res.status(201).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Posting Project',
                stack: e.stack
            });
        }
    };
};
