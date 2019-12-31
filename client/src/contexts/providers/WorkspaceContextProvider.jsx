import React, { useReducer, useContext } from 'react';
import WorkspaceContext from '../WorkspaceContext';
import workspaceApi from '../../services/workspace.api.service';

export const workspaceActionTypes = {
    getWorkspaces: 'GET_WORKSPACES',
    getWorkspace: 'GET_WORKSPACE',
    updateWorkspacesLoading: 'UPDATE_WORKSPACES_LOADING',
    setWorkspace: 'SET_WORKSPACE'
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
    return async (workspaceId) => {
        let payload;
        try {
            payload = await workspaceApi.getWorkspace(workspaceId);
        } finally {
            dispatch({ type: workspaceActionTypes.getWorkspace, payload });
        }
    };
}

function setWorkspace(dispatch) {
    return (workspace) => {
        dispatch({ type: workspaceActionTypes.setWorkspace, payload: workspace });
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
                workspace: action.payload
                    ? {
                        ...action.payload
                    }
                    : undefined
            };
        case workspaceActionTypes.setWorkspace:
            return {
                ...state,
                workspace: action.payload
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
        ...initialState
    });

    const context = {
        ...state,
        actions: {
            getWorkspaces: getWorkspaces(dispatch, state),
            getWorkspace: getWorkspace(dispatch, state),
            setWorkspace: setWorkspace(dispatch, state)
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
