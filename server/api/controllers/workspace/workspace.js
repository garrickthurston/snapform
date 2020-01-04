import WorkspaceDbService from '../../services/workspace/workspace.db.service';

export default function WorkspaceController() {
    this.workspaceDbService = new WorkspaceDbService();

    this.updateWorkspaceConfig = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { ...config } = req.body;

            const workspace = await this.workspaceDbService.getWorkspace(workspaceId);
            const results = await this.workspaceDbService.updateWorkspace({
                ...workspace,
                config
            });

            res.status(200).json(results);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Updating Workspace Config',
                stack: e.stack
            });
        }
    };

    this.getAllUserWorkspaces = async (req, res) => {
        try {
            const { sub } = req.payload;

            const results = await this.workspaceDbService.getAllUserWorkspaces(sub);

            res.status(200).json(results);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Retrieving All User Workspaces',
                stack: e.stack
            });
        }
    };

    this.postUserWorkspace = async (req, res) => {
        try {
            const { sub } = req.payload;
            const { ...workspace } = req.body;

            const result = await this.workspaceDbService.initiateUserWorkspace(sub, workspace);
            if (!result) {
                throw new Error();
            }

            res.status(201).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Posting User Workspace',
                stack: e.stack
            });
        }
    };
};
