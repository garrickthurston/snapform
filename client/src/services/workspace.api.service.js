import api from '../utils/api';

function getWorkspaces() {
    return api.get('workspaces');
}

function getWorkspace(workspaceId) {
    return api.get(`workspaces/${workspaceId}`);
}

export default {
    getWorkspaces,
    getWorkspace
};
