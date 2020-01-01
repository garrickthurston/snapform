import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import { useUser } from '../../contexts/providers/UserContextProvider';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceNav from './WorkspaceNav';
import WorkspaceTabs from './WorkspaceTabs';
import ProjectGrid from './core/ProjectGrid';
import WorkspaceDebug from './WorkspaceDebug';
import LoadingPulse from '../core/LoadingPulse';
import './Workspace.scss';

export default function Workspace() {
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
            return (<WorkspaceDebug />);
        }

        return null;
    }, [user.data]);

    const renderGridView = useMemo(() => {
        if (!workspace.workspaceLoaded) {
            return (
                <div className="workspace-editor-body">
                    <LoadingPulse />
                </div>
            );
        }

        const activeProject = workspace.workspace
            && workspace.workspace.projects
            && workspace.workspace.projects.find((item) => item.active);

        if (workspace.projectLoading) {
            return (
                <div className="workspace-editor-body">
                    <ProjectGrid project={activeProject} loading={workspace.projectLoading} />
                    <LoadingPulse />
                </div>
            );
        }

        return (
            <div className="workspace-editor-body">
                <ProjectGrid project={activeProject} />
            </div>
        );
    }, [workspace]);

    return (
        <div className="workspace-container">
            <div className="workspace">
                <div className="workspace-head">
                    <WorkspaceHeader />
                </div>
                <div className="workspace-body">
                    <div className="workspace-nav">
                        <WorkspaceNav />
                    </div>
                    <div className="workspace-editor">
                        <div className="workspace-tabs">
                            <WorkspaceTabs loading={workspace.workspaceLoading || workspace.projectLoading} />
                        </div>
                        {renderGridView}
                    </div>
                </div>
            </div>
            {renderDebugComponent}
        </div>
    );
}
