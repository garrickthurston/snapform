import api from '../utils/api';

function getWorkspaces() {
    return api.get('workspaces');
}

function getWorkspace(workspaceId) {
    return api.get(`workspaces/${workspaceId}`);
}

function getWorkspaceProject(workspaceId, projectId) {
    return api.get(`workspaces/${workspaceId}/projects/${projectId}`);
}

export default {
    getWorkspaces,
    getWorkspace,
    getWorkspaceProject
};
