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
        if (workspace.workspacesLoaded && workspace.workspaces.length && !workspace.workspace) {
            workspace.actions.setWorkspace(workspace.workspaces[0]);
        }
    }, [workspace.workspacesLoaded, workspace.workspaces, workspace.workspace, workspace.actions]);

    const renderDebugComponent = useMemo(() => {
        const { isAdmin } = user.data;
        if (isAdmin) {
            return (<WorkspaceDebugComponent />);
        }

        return null;
    }, [user.data]);

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
                            <GridComponent />
                        </div>
                    </div>
                </div>
            </div>
            {renderDebugComponent}
        </div>
    );
}
