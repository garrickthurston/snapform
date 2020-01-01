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

function postWorkspaceProject(workspaceId, projectName = null) {
    return api.post(`workspaces/${workspaceId}/projects`, { projectName });
}

export default {
    getWorkspaces,
    getWorkspace,
    getWorkspaceProject,
    postWorkspaceProject
};
