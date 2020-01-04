import React, { useEffect, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import { useUser } from '../../contexts/providers/UserContextProvider';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceNav from './nav/WorkspaceNav';
import WorkspaceTabs from './WorkspaceTabs';
import ProjectGrid from './editor/ProjectGrid';
import ProjectHeader from './editor/ProjectHeader';
import WorkspaceDebug from './WorkspaceDebug';
import LoadingPulse from '../core/LoadingPulse';
import './Workspace.scss';

export default function Workspace() {
    // const params = useParams();
    const user = useUser();
    const { workspaces, ...workspace } = useWorkspace();

    useEffect(() => {
        if (!workspace.workspacesLoading && !workspace.workspacesLoaded) {
            workspace.actions.getWorkspaces();
        }
    }, [
        workspace.workspacesLoading,
        workspace.workspacesLoaded,
        workspace.actions
    ]);

    const renderDebugComponent = useMemo(() => {
        const { isAdmin } = user.data;
        if (isAdmin) {
            return (<WorkspaceDebug />);
        }

        return null;
    }, [user.data]);

    let activeWorkspace = {};
    if (workspaces && workspaces.length) {
        activeWorkspace = workspaces.find((x) => x.workspaceId === workspace.config.activeWorkspaceId) || {};
    }

    const renderGridView = useMemo(() => {
        if (!workspace.workspacesLoaded) {
            return (<LoadingPulse />);
        }

        if (!activeWorkspace.config || !activeWorkspace.config.activeProjectId) {
            if (workspace.workspaceLoading || workspace.projectLoading) {
                return (<LoadingPulse />);
            }

            // TODO - Add "Create" CTA
            return null;
        }

        const activeProject = activeWorkspace
            .projects
            .find((x) => activeWorkspace.config.activeProjectId.toLowerCase() === x.projectId.toLowerCase());

        return (
            <div className="editor-container">
                <div className="editor-header">
                    <ProjectHeader project={activeProject} />
                </div>
                <div className="editor-grid">
                    {(workspace.workspaceLoading || workspace.projectLoading) && (<LoadingPulse />)}
                    <ProjectGrid project={activeProject} loading={workspace.workspaceLoading || workspace.projectLoading} />
                </div>
            </div>
        );
    }, [workspace, activeWorkspace]);

    return (
        <div className="workspace-container">
            <div className="workspace">
                <div className="workspace-nav">
                    <WorkspaceNav />
                </div>
                <div className="workspace-body">
                    <div className="workspace-head">
                        <WorkspaceHeader activeWorkspace={activeWorkspace} />
                    </div>
                    <div className="workspace-editor">
                        <div className="workspace-tabs">
                            <WorkspaceTabs activeWorkspace={activeWorkspace} />
                        </div>
                        <div className="workspace-editor-body">
                            {renderGridView}
                        </div>
                    </div>
                </div>
            </div>
            {renderDebugComponent}
        </div>
    );
}
