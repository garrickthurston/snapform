import api from '../utils/api';

function getWorkspaces() {
    return api.get('workspaces');
}

function getWorkspace(workspaceId) {
    return api.get(`workspaces/${workspaceId}`);
}

function postWorkspace() {
    return api.post('workspaces');
}

function getWorkspaceProject(workspaceId, projectId) {
    return api.get(`workspaces/${workspaceId}/projects/${projectId}`);
}

function postWorkspaceProject(workspaceId, projectName = null) {
    return api.post(`workspaces/${workspaceId}/projects`, { projectName });
}

function putWorkspaceProject(workspaceId, projectId, project) {
    return api.put(`workspaces/${workspaceId}/projects/${projectId}`, project);
}

function putWorkspaceConfig(workspaceId, config) {
    return api.put(`workspaces/${workspaceId}/config`, config);
}

function putUserWorkspaceConfig(config) {
    return api.put('workspaces/config', config);
}

function deleteWorkspaceProject(workspaceId, projectId) {
    return api.del(`workspaces/${workspaceId}/projects/${projectId}`);
}

export default {
    getWorkspaces,
    getWorkspace,
    putWorkspaceConfig,
    postWorkspace,
    getWorkspaceProject,
    postWorkspaceProject,
    putWorkspaceProject,
    putUserWorkspaceConfig,
    deleteWorkspaceProject
};
