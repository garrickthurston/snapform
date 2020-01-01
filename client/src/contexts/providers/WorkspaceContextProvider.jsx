import React, { useReducer, useContext } from 'react';
import WorkspaceContext from '../WorkspaceContext';
import workspaceApi from '../../services/workspace.api.service';

export const workspaceActionTypes = {
    getWorkspaces: 'GET_WORKSPACES',
    getWorkspace: 'GET_WORKSPACE',
    updateWorkspacesLoading: 'UPDATE_WORKSPACES_LOADING',
    updateWorkspaceLoading: 'UPDATE_WORKSPACE_LOADING',
    setProjectTabStatus: 'SET_PROJECT_TAB_STATUS',
    setProjectActive: 'SET_PROJECT_ACTIVE',
    initiateProject: 'INITIATE_PROJECT',
    setProjectLoading: 'SET_PROJECT_LOADING'
};

function getWorkspaces(dispatch) {
    return async () => {
        dispatch({ type: workspaceActionTypes.updateWorkspacesLoading, payload: true });

        let payload = [];
        try {
            payload = await workspaceApi.getWorkspaces();
        } finally {
            dispatch({ type: workspaceActionTypes.getWorkspaces, payload });
        }
    };
}

function getWorkspace(dispatch) {
    return async (workspaceId, projectId) => {
        dispatch({ type: workspaceActionTypes.updateWorkspaceLoading, payload: true });

        let payload;
        try {
            payload = await workspaceApi.getWorkspace(workspaceId);
            const { projects } = payload;

            let projectIdToFetch = projectId;
            if (!projectIdToFetch) {
                projectIdToFetch = projects[0].projectId;
            }

            const fetchedProject = await workspaceApi.getWorkspaceProject(workspaceId, projectIdToFetch);
            projects.map((item) => {
                const project = item;
                project.active = false;
                project.tabStatus = false;
                return project;
            });
            const project = projects.find((x) => x.projectId === projectIdToFetch);
            projects.splice(projects.indexOf(project), 1, {
                ...fetchedProject,
                active: true,
                tabStatus: true
            });
        } finally {
            dispatch({ type: workspaceActionTypes.getWorkspace, payload });
        }
    };
}

function setProjectTabStatus(dispatch, state) {
    return (projectId, tabStatus) => {
        const { workspace } = state;
        if (workspace) {
            const { projects } = workspace;
            const updatedProjects = [...projects];
            const project = updatedProjects.find((item) => item.projectId === projectId);
            updatedProjects.splice(updatedProjects.indexOf(project), 1, {
                ...project,
                tabStatus
            });

            dispatch({
                type: workspaceActionTypes.setProjectTabStatus,
                payload: {
                    ...workspace,
                    projects: updatedProjects
                }
            });
        }
    };
}

function setProjectActive(dispatch, state) {
    return (projectId) => {
        const { workspace } = state;
        if (workspace) {
            const { projects } = workspace;
            const updatedProjects = [...projects.map((item) => ({
                ...item,
                active: false
            }))];
            const project = updatedProjects.find((item) => item.projectId === projectId);
            updatedProjects.splice(updatedProjects.indexOf(project), 1, {
                ...project,
                active: true
            });

            dispatch({
                type: workspaceActionTypes.setProjectActive,
                payload: {
                    ...workspace,
                    projects: updatedProjects
                }
            });
        }
    };
}

function initiateProject(dispatch, state) {
    return async (workspaceId, projectName = null) => {
        dispatch({ type: workspaceActionTypes.setProjectLoading, payload: true });

        const { workspace } = state;
        let updatedProjects = [];
        try {
            const project = {
                ...await workspaceApi.postWorkspaceProject(workspaceId, projectName),
                active: true,
                tabStatus: true
            };

            if (workspace) {
                const { projects } = workspace;
                updatedProjects = [
                    ...projects.map((item) => ({
                        ...item,
                        active: false
                    })),
                    project
                ];
            }
        } finally {
            dispatch({
                type: workspaceActionTypes.initiateProject,
                payload: {
                    ...workspace,
                    projects: updatedProjects || workspace.projects
                }
            });
        }
    };
}

export function workspaceReducer(state, action) {
    switch (action.type) {
        case workspaceActionTypes.updateWorkspacesLoading:
            return {
                ...state,
                workspacesLoading: action.payload
            };
        case workspaceActionTypes.getWorkspaces:
            return {
                ...state,
                workspaces: [
                    ...action.payload
                ],
                workspacesLoaded: true,
                workspacesLoading: false
            };
        case workspaceActionTypes.getWorkspace:
            return {
                ...state,
                workspace: action.payload,
                workspaceLoading: false,
                workspaceLoaded: true
            };
        case workspaceActionTypes.updateWorkspaceLoading:
            return {
                ...state,
                workspaceLoading: action.payload
            };
        case workspaceActionTypes.setProjectTabStatus:
            return {
                ...state,
                workspace: action.payload
            };
        case workspaceActionTypes.setProjectActive:
            return {
                ...state,
                workspace: action.payload
            };
        case workspaceActionTypes.setProjectLoading:
            return {
                ...state,
                projectLoading: action.payload
            };
        case workspaceActionTypes.initiateProject:
            return {
                ...state,
                workspace: action.payload,
                projectLoading: false
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
        workspace: undefined,
        workspaceLoading: false,
        workspaceLoaded: false,
        project: undefined,
        projectLoading: false,
        ...initialState
    });

    const context = {
        ...state,
        actions: {
            getWorkspaces: getWorkspaces(dispatch, state),
            getWorkspace: getWorkspace(dispatch, state),
            setProjectTabStatus: setProjectTabStatus(dispatch, state),
            setProjectActive: setProjectActive(dispatch, state),
            initiateProject: initiateProject(dispatch, state)
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
