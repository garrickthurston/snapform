import React, { useReducer, useContext } from 'react';
import WorkspaceContext from '../WorkspaceContext';
import workspaceApi from '../../services/workspace.api.service';

export const workspaceActionTypes = {
    setWorkspacesLoading: 'SET_WORKSPACES_LOADING',
    initiateWorkspace: 'INITIATE_WORKSPACE',
    getWorkspaces: 'GET_WORKSPACES',
    setProjectLoading: 'SET_PROJECT_LOADING',
    getProject: 'GET_PROJECT',
    initiateProject: 'INITIATE_PROJECT',
    updateWorkspaceConfig: 'UPDATE_WORKSPACE_CONFIG',
    deleteProject: 'DELETE_PROJECT',
    collapseAll: 'COLLAPSE_ALL',
    updateWorkspaceCollapsed: 'UPDATE_WORKSPACE_COLLAPSE'
};

function initiateWorkspace(dispatch, state) {
    return async () => {
        dispatch({ type: workspaceActionTypes.setWorkspacesLoading, payload: true });

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
            const data = await workspaceApi.getWorkspaces();
            payload = {
                ...data,
                results: [
                    ...data.results.map((item) => ({
                        ...item,
                        collapsed: false
                    }))
                ]
            };
        } finally {
            dispatch({ type: workspaceActionTypes.getWorkspaces, payload });
        }
    };
}

function getProject(dispatch, state) {
    return async (workspaceId, projectId) => {
        dispatch({ type: workspaceActionTypes.setProjectLoading, payload: true });

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
    return async (workspaceId, config, updateActiveWorkspace = false) => {
        dispatch({ type: workspaceActionTypes.setProjectLoading, payload: true });

        let payload = {
            ...state,
            workspaces: [
                ...state.workspaces
            ]
        };
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

            let userConfig = payload.config;
            if (updateActiveWorkspace && workspaceId.toLowerCase() !== payload.config.activeWorkspaceId.toLowerCase()) {
                userConfig = await workspaceApi.putUserWorkspaceConfig({
                    ...payload.config,
                    activeWorkspaceId: workspaceId
                });
            }

            payload.workspaces.splice(payload.workspaces.indexOf(workspace), 1, {
                ...updatedWorkspace,
                projects: workspace.projects
            });
            payload = {
                ...payload,
                config: userConfig
            };
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

function deleteProject(dispatch, state) {
    return async (workspaceId, projectId) => {
        dispatch({ type: workspaceActionTypes.setProjectLoading, payload: true });

        let payload = state;
        try {
            const workspace = payload.workspaces.find((item) => item.workspaceId.toLowerCase() === workspaceId.toLowerCase());
            let updatedWorkspace = await workspaceApi.deleteWorkspaceProject(workspaceId, projectId);

            const project = workspace.projects.find((item) => item.projectId.toLowerCase() === projectId.toLowerCase());
            const updatedProjects = [...workspace.projects];
            updatedProjects.splice(workspace.projects.indexOf(project), 1);
            const { config } = state;
            const updatedConfig = { ...config };
            if (config.activeWorkspaceId && config.activeWorkspaceId.toLowerCase() === workspaceId.toLowerCase()) {
                if (workspace.projects.length > 1) {
                    updatedConfig.activeWorkspaceId = config.activeWorkspaceId;
                } else if (state.workspaces.length > 1) {
                    const newWorkspace = state.workspaces.find((item) => item.workspaceId.toLowerCase() !== workspaceId.toLowerCase());
                    updatedConfig.activeWorkspaceId = newWorkspace ? newWorkspace.workspaceId : null;
                } else {
                    updatedConfig.activeWorkspaceId = null;
                }
            }
            if (updatedWorkspace) {
                updatedWorkspace = {
                    ...updatedWorkspace,
                    projects: updatedProjects
                };
            }
            payload = {
                workspaces: [
                    ...state.workspaces
                ],
                config: updatedConfig
            };
            if (updatedWorkspace) {
                payload.workspaces.splice(payload.workspaces.indexOf(workspace), 1, updatedWorkspace);
            } else {
                payload.workspaces.splice(payload.workspaces.indexOf(workspace), 1);
            }
        } finally {
            dispatch({ type: workspaceActionTypes.deleteProject, payload });
        }
    };
}

function collapseAll(dispatch, state) {
    return () => {
        const payload = [
            ...state.workspaces.map((item) => ({
                ...item,
                collapsed: true
            }))
        ];
        dispatch({ type: workspaceActionTypes.collapseAll, payload });
    };
}

function updateWorkspaceCollapsed(dispatch, state) {
    return (workspaceId, collapsed) => {
        const workspace = state.workspaces.find((item) => item.workspaceId.toLowerCase() === workspaceId.toLowerCase());
        const updatedWorkspace = {
            ...workspace,
            collapsed
        };
        const payload = [
            ...state.workspaces
        ];
        payload.splice(payload.indexOf(workspace), 1, updatedWorkspace);
        dispatch({ type: workspaceActionTypes.updateWorkspaceCollapsed, payload });
    };
}

function workspaceReducer(state, action) {
    switch (action.type) {
        case workspaceActionTypes.setWorkspacesLoading:
            return {
                ...state,
                workspacesLoading: action.payload
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
                workspaces: action.payload.results,
                setWorkspacesLoading: false,
                setWorkspacesLoaded: true
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
                ...action.payload,
                projectLoading: false,
                projectLoaded: true
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
        case workspaceActionTypes.deleteProject:
            return {
                ...state,
                ...action.payload,
                projectLoading: false,
                projectLoaded: true
            };
        case workspaceActionTypes.collapseAll:
            return {
                ...state,
                workspaces: action.payload
            };
        case workspaceActionTypes.updateWorkspaceCollapsed:
            return {
                ...state,
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
        workspaces: [],
        projectLoading: false,
        projectLoaded: false,
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
            updateWorkspaceConfig: updateWorkspaceConfig(dispatch, state),
            deleteProject: deleteProject(dispatch, state),
            collapseAll: collapseAll(dispatch, state),
            updateWorkspaceCollapsed: updateWorkspaceCollapsed(dispatch, state)
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
