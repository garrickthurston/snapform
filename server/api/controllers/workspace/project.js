import ProjectDbService from '../../services/workspace/project.db.service';

export default function ProjectController() {
    this.projectDbService = new ProjectDbService();

    this.getProject = async (req, res) => {
        try {
            const { workspaceId, projectId } = req.params;

            const result = await this.projectDbService.getProject(workspaceId, projectId);

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
};
