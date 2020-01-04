import React, { useReducer, useContext } from 'react';
import WorkspaceContext from '../WorkspaceContext';
import workspaceApi from '../../services/workspace.api.service';

export const workspaceActionTypes = {
    setWorkspacesLoading: 'SET_WORKSPACES_LOADING',
    setWorkspaceInitiating: 'SET_WORKSPACE_INITIATING',
    initiateWorkspace: 'INITIATE_WORKSPACE',
    getWorkspaces: 'GET_WORKSPACES',
    setProjectLoading: 'SET_PROJECT_LOADING',
    getProject: 'GET_PROJECT',
    initiateProject: 'INITIATE_PROJECT',
    updateWorkspaceConfig: 'UPDATE_WORKSPACE_CONFIG'
};

function initiateWorkspace(dispatch, state) {
    return async () => {
        dispatch({ type: workspaceActionTypes.setWorkspaceInitiating, payload: true });

        let payload = state.workspaces;
        try {
            payload = await workspaceApi.postWorkspace();
        } finally {
            dispatch({ type: workspaceActionTypes.initiateWorkspace, payload });
        }
    };
}

function getWorkspaces(dispatch) {
    return async () => {
        dispatch({ type: workspaceActionTypes.setWorkspacesLoading, payload: true });

        let payload = [];
        try {
            payload = await workspaceApi.getWorkspaces();
        } finally {
            dispatch({ type: workspaceActionTypes.getWorkspaces, payload });
        }
    };
}

function getProject(dispatch, state) {
    return async (workspaceId, projectId) => {
        dispatch({ type: workspaceActionTypes.setWorkspaceInitiating, payload: true });

        let payload = state.workspaces;
        try {
            const project = await workspaceApi.getWorkspaceProject(workspaceId, projectId);
            const workspace = state.workspaces.find((item) => item.workspaceId === workspaceId);
            const projectToUpdate = workspace.projects.find((item) => item.projectId === projectId);

            const updatedProjects = workspace.projects.splice(workspace.project.indexOf(projectToUpdate), 1, project);
            const updatedWorkspaces = state.workspaces.splice(state.workspaces.indexOf(workspace), 1, {
                ...workspace,
                projects: updatedProjects
            });

            payload = [
                ...updatedWorkspaces
            ];
        } finally {
            dispatch({ type: workspaceActionTypes.getProject, payload });
        }
    };
}

function updateWorkspaceConfig(dispatch, state) {
    return async (workspaceId, config) => {
        dispatch({ type: workspaceActionTypes.setProjectLoading, payload: true });

        let payload = state.workspaces;
        try {
            const workspace = state.workspaces.find((item) => item.workspaceId === workspaceId);

            const updatedWorkspace = await workspaceApi.putWorkspaceConfig(workspaceId, config);
            if (updatedWorkspace.config.activeProjectId) {
                const activeProject = workspace.projects.find((item) => item.projectId.toLowerCase() === updatedWorkspace.config.activeProjectId.toLowerCase());
                if (!activeProject.config) {
                    const project = await workspaceApi.getWorkspaceProject(workspaceId, activeProject.projectId);
                    workspace.projects.splice(workspace.projects.indexOf(activeProject), 1, {
                        ...activeProject,
                        ...project
                    });
                }
            }

            payload = [
                ...state.workspaces
            ];
            payload.splice(payload.indexOf(workspace), 1, {
                ...updatedWorkspace,
                projects: workspace.projects
            });
        } finally {
            dispatch({ type: workspaceActionTypes.updateWorkspaceConfig, payload });
        }
    };
}

function initiateProject(dispatch, state) {
    return async (workspaceId) => {
        dispatch({ type: workspaceActionTypes.setProjectLoading, payload: true });

        let payload = state.workspaces;
        try {
            const project = await workspaceApi.postWorkspaceProject(workspaceId);
            const workspace = state.workspaces.find((item) => item.workspaceId === workspaceId);

            const updatedProjects = [
                ...workspace.projects,
                project
            ];
            const updatedWorkspace = {
                ...workspace,
                projects: updatedProjects,
                config: {
                    ...workspace.config,
                    activeProjectId: project.projectId,
                    activeProjectTabs: [
                        ...(workspace.config.activeProjectTabs || []),
                        project.projectId
                    ]
                }
            };
            payload = [
                ...state.workspaces
            ];
            payload.splice(payload.indexOf(workspace), 1, updatedWorkspace);
        } finally {
            dispatch({ type: workspaceActionTypes.initiateProject, payload });
        }
    };
}

function workspaceReducer(state, action) {
    switch (action.type) {
        case workspaceActionTypes.setWorkspacesLoading:
            return {
                ...state,
                workspacesLoading: action.payload
            };
        case workspaceActionTypes.setWorkspaceInitiating:
            return {
                ...state,
                workspaceInitiating: action.payload
            };
        case workspaceActionTypes.getWorkspaces:
            return {
                ...state,
                config: action.payload.config,
                workspaces: action.payload.results,
                workspacesLoading: false,
                workspacesLoaded: true
            };
        case workspaceActionTypes.initiateWorkspace:
            return {
                ...state,
                config: action.payload.config,
                workspaces: action.payload.workspaces,
                workspaceInitiating: false,
                workspaceInitiated: true
            };
        case workspaceActionTypes.getProject:
            return {
                ...state,
                workspaces: action.payload,
                projectLoading: false,
                projectLoaded: true
            };
        case workspaceActionTypes.updateWorkspaceConfig:
            return {
                ...state,
                projectLoading: false,
                projectLoaded: true,
                workspaces: action.payload
            };
        case workspaceActionTypes.setProjectLoading:
            return {
                ...state,
                projectLoading: action.payload
            };
        case workspaceActionTypes.initiateProject:
            return {
                ...state,
                projectLoading: false,
                projectLoaded: true,
                workspaces: action.payload
            };
        default:
            return state;
    }
}

function WorkspaceContextProvider({ children, initialState = {} }) {
    const [state, dispatch] = useReducer(workspaceReducer, {
        workspacesLoading: false,
        workspacesLoaded: false,
        workspaceInitiating: false,
        workspaceInitiated: false,
        workspaces: [],
        projectLoading: false,
        config: undefined,
        ...initialState
    });

    const context = {
        ...state,
        actions: {
            getWorkspaces: getWorkspaces(dispatch, state),
            initiateWorkspace: initiateWorkspace(dispatch, state),
            getProject: getProject(dispatch, state),
            initiateProject: initiateProject(dispatch, state),
            updateWorkspaceConfig: updateWorkspaceConfig(dispatch, state)
        }
    };

    return (
        <WorkspaceContext.Provider value={context}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export default WorkspaceContextProvider;

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);

    if (!context.actions) {
        throw new Error('useWorkspace can\'t be used outside of a WorkspaceContextProvider');
    }

    return context;
};
