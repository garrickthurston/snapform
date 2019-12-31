import React, { useReducer, useContext } from 'react';
import WorkspaceContext from '../WorkspaceContext';
import workspaceApi from '../../services/workspace.api.service';

export const workspaceActionTypes = {
    getWorkspaces: 'GET_WORKSPACES',
    getWorkspace: 'GET_WORKSPACE',
    updateWorkspacesLoading: 'UPDATE_WORKSPACES_LOADING',
    updateWorkspaceLoading: 'UPDATE_WORKSPACE_LOADING'
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
                return project;
            });
            const project = projects.find((x) => x.projectId === projectIdToFetch);
            projects.splice(projects.indexOf(project), 1, {
                ...fetchedProject,
                active: true
            });
        } finally {
            dispatch({ type: workspaceActionTypes.getWorkspace, payload });
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
        ...initialState
    });

    const context = {
        ...state,
        actions: {
            getWorkspaces: getWorkspaces(dispatch, state),
            getWorkspace: getWorkspace(dispatch, state)
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
