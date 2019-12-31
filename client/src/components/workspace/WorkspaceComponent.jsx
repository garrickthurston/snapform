import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceHeaderComponent from './WorkspaceHeaderComponent';
import WorkspaceNavComponent from './WorkspaceNavComponent';
import WorkspaceTabsComponent from './WorkspaceTabsComponent';
import GridComponent from './core/GridComponent';
import WorkspaceDebugComponent from './WorkspaceDebugComponent';
import './WorkspaceComponent.scss';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import { useUser } from '../../contexts/providers/UserContextProvider';
import LoadingComponent from '../core/LoadingComponent';

export default function WorkspaceComponent() {
    // eslint-disable-next-line no-unused-vars
    const params = useParams();
    const user = useUser();
    const workspace = useWorkspace();

    useEffect(() => {
        if (!workspace.workspacesLoaded && !workspace.workspacesLoading) {
            workspace.actions.getWorkspaces();
        }
    }, [workspace.workspacesLoading, workspace.workspacesLoaded, workspace.actions]);

    useEffect(() => {
        if (workspace.workspacesLoaded
            && workspace.workspaces.length
            && !workspace.workspaceLoaded
            && !workspace.workspaceLoading) {
            const { workspaceId } = workspace.workspaces[0];
            workspace.actions.getWorkspace(params.workspaceId || workspaceId);
        }
    }, [
        workspace.workspacesLoaded,
        workspace.workspaces,
        workspace.workspace,
        workspace.workspaceLoading,
        workspace.workspaceLoaded,
        workspace.actions,
        params
    ]);

    const renderDebugComponent = useMemo(() => {
        const { isAdmin } = user.data;
        if (isAdmin) {
            return (<WorkspaceDebugComponent />);
        }

        return null;
    }, [user.data]);

    const activeProject = workspace.workspace
        && workspace.workspace.projects
        && workspace.workspace.projects.find((item) => item.active);
    return (
        <div className="workspace-container">
            <div className="workspace">
                <div className="workspace-head">
                    <WorkspaceHeaderComponent />
                </div>
                <div className="workspace-body">
                    <div className="workspace-nav">
                        <WorkspaceNavComponent />
                    </div>
                    <div className="workspace-editor">
                        <div className="workspace-tabs">
                            <WorkspaceTabsComponent />
                        </div>
                        <div className="workspace-editor-body">
                            {workspace.workspaceLoaded ? <GridComponent project={activeProject} /> : <LoadingComponent />}
                        </div>
                    </div>
                </div>
            </div>
            {renderDebugComponent}
        </div>
    );
}
