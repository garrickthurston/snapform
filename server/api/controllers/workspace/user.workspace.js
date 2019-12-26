import UserWorkspaceDbService from '../../services/workspace/user.workspace.db.service';

export default function UserWorkspaceController() {
    this.userWorkspaceDbService = new UserWorkspaceDbService();

    this.getAllUserWorkspaces = async (req, res) => {
        try {
            const { sub } = req.payload;

            const results = await this.userWorkspaceDbService.getAllUserWorkspaces(sub);

            res.status(200).json(results);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Retrieving All User Workspaces',
                stack: e.stack
            });
        }
    };

    this.getUserWorkspace = async (req, res) => {
        try {
            const { sub } = req.payload;
            const { workspaceId } = req.params;

            const result = await this.userWorkspaceDbService.getUserWorkspace(sub, workspaceId);

            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Retrieving User Workspace',
                stack: e.stack
            });
        }
    };

    this.postUserWorkspace = async (req, res) => {
        try {
            const { sub } = req.payload;
            const { workspace } = req.body;
            if (!workspace) {
                throw new Error('Post Body Required');
            }

            const result = await this.userWorkspaceDbService.initiateUserWorkspace(sub, workspace);
            if (!result) {
                throw new Error();
            }

            res.status(201).json(result);
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Retrieving User Workspace',
                stack: e.stack
            });
        }
    };
};
