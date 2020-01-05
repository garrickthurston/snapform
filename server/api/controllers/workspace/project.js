import ProjectDbService from '../../services/workspace/project.db.service';
import WorkspaceDbService from '../../services/workspace/workspace.db.service';
import { isGuid } from '../../../utils/encryptionUtils';

export default function ProjectController() {
    this.projectDbService = new ProjectDbService();
    this.workspaceDbService = new WorkspaceDbService();

    this.getProject = async (req, res) => {
        try {
            const { projectId } = req.params;
            if (!projectId || !isGuid(projectId)) {
                return res.status(400).json({
                    error: 'Bad Request'
                });
            }

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

            if (!workspaceId || !projectId || (workspaceId && !isGuid(workspaceId)) || (projectId && !isGuid(projectId))) {
                return res.status(400).json({
                    error: 'Bad Request'
                });
            }

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

            if (!workspaceId || !isGuid(workspaceId)) {
                return res.status(400).json({
                    error: 'Bad Request'
                });
            }

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

    this.deleteProject = async (req, res) => {
        try {
            const { sub } = req.payload;
            const { workspaceId, projectId } = req.params;
            if (!workspaceId || !projectId || (workspaceId && !isGuid(workspaceId)) || (projectId && !isGuid(projectId))) {
                return res.status(400).json({
                    error: 'Bad Request'
                });
            }
            
            await this.projectDbService.deleteProject(sub, workspaceId, projectId);
            const workspace = await this.workspaceDbService.getWorkspace(workspaceId);
            
            let result = null;
            if (workspace) {
                const { activeProjectId, activeProjectTabs } = workspace.config;
                let newActiveProjectId = activeProjectId;
                const lowerProjectTabs = activeProjectTabs.map(item => item.toLowerCase());
                const idx = lowerProjectTabs.indexOf(projectId.toLowerCase());
                if (idx > -1) {
                    activeProjectTabs.splice(idx, 1);
                }
                if (activeProjectId && activeProjectId.toLowerCase() === projectId.toLowerCase()) {
                    newActiveProjectId = activeProjectTabs.length ? activeProjectTabs[activeProjectTabs.length - 1] : null;
                }
                await this.workspaceDbService.updateWorkspace({
                    ...workspace,
                    config: {
                        ...workspace.config,
                        activeProjectId: newActiveProjectId,
                        activeProjectTabs: [
                            ...activeProjectTabs
                        ]
                    }
                });
                result = await this.workspaceDbService.getWorkspace(workspaceId);
            }

            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Deleting Project',
                stack: e.stack
            });
        }
    };
};
