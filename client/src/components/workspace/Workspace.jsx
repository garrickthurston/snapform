import React, {
    useEffect,
    useMemo,
    useCallback,
    useState,
    useRef
} from 'react';
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
    const user = useUser();
    const { workspaces, ...workspace } = useWorkspace();
    const [navStyle, setNavStyle] = useState({});
    const [navResizing, setNavResizing] = useState(null);
    const navRef = useRef(null);

    useEffect(() => {
        if (!workspace.workspacesLoading && !workspace.workspacesLoaded) {
            workspace.actions.getWorkspaces();
        }
    }, [
        workspace.workspacesLoading,
        workspace.workspacesLoaded,
        workspace.actions
    ]);

    const handleResizeMouseDown = useCallback(() => {
        if (!navRef.current) {
            return;
        }

        const { offsetWidth } = navRef.current;

        setNavResizing(true);
        setNavStyle({
            ...navStyle,
            width: offsetWidth
        });
    }, [
        navStyle,
        setNavStyle,
        navRef,
        setNavResizing
    ]);

    const handleResizeMouseMove = useCallback((evt) => {
        if (!navResizing || !navRef.current) {
            return;
        }

        evt.stopPropagation();
        evt.preventDefault();

        const { clientX } = evt;

        setNavStyle({
            ...navStyle,
            width: clientX
        });
    }, [
        navRef,
        navStyle,
        setNavStyle,
        navResizing
    ]);

    const handleResizeMouseUp = useCallback((evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        setNavResizing(false);
    }, [setNavResizing]);

    useEffect(() => {
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleResizeMouseMove);
            document.removeEventListener('mouseup', handleResizeMouseUp);
        };
    });

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
                <div className="workspace-nav" ref={navRef} style={navStyle}>
                    <WorkspaceNav />
                    <div
                        role="button"
                        className="ws-nav-resize"
                        onMouseDown={handleResizeMouseDown}
                        onMouseMove={handleResizeMouseMove}
                    />
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
