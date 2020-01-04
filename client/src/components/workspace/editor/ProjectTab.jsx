import React, { useMemo, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import './ProjectTab.scss';

const _tabClassName = 'project-tab-outer';
export default function Tab({ project, active, add }) {
    const workspace = useWorkspace();
    const loading = workspace.workspaceLoading || workspace.projectLoading;
    const tabClassName = `${_tabClassName} ${(project && project.active) || active ? 'active' : ''} ${add ? 'add' : ''}`;
    const closeRef = useRef(null);

    const closeTab = useCallback(() => {
        if (loading) {
            return;
        }

        const { activeWorkspaceId } = workspace.config;
        const activeWorkspace = workspace.workspaces.find((item) => item.workspaceId === activeWorkspaceId);

        let { activeProjectId } = activeWorkspace.config;
        const { activeProjectTabs } = activeWorkspace.config;
        if (activeProjectId.toLowerCase() === project.projectId.toLowerCase()) {
            activeProjectId = activeProjectTabs.length > 1 ? activeProjectTabs[activeProjectTabs.length - 2] : null;
        }

        const projectId = activeProjectTabs.find((x) => x.toLowerCase() === project.projectId);
        activeProjectTabs.splice(activeProjectTabs.indexOf(projectId), 1);

        workspace.actions.updateWorkspaceConfig(activeWorkspaceId, {
            ...activeWorkspace.config,
            activeProjectId,
            activeProjectTabs
        });
    }, [
        workspace.actions,
        workspace.config,
        workspace.workspaces,
        project,
        loading
    ]);

    const renderTabText = useMemo(() => {
        if (project) { return project.projectName; }
        if (add) { return (<FontAwesomeIcon icon={faPlus} />); }

        return '';
    }, [project, add]);

    const renderTabClose = useMemo(() => {
        if (add) {
            return null;
        }

        return (
            <button className="tab-close" onClick={closeTab} ref={closeRef}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        );
    }, [add, closeTab]);

    const handleTabClick = useCallback((evt) => {
        if (loading) {
            return;
        }

        const { activeWorkspaceId } = workspace.config;
        if (add && !workspace.projectLoading) {
            workspace.actions.initiateProject(activeWorkspaceId);
            return;
        }

        if (closeRef && closeRef.current && closeRef.current.contains(evt.target)) {
            return;
        }

        const activeWorkspace = workspace.workspaces.find((item) => item.workspaceId === activeWorkspaceId);
        if (activeWorkspace.config.activeProjectId.toLowerCase() === project.projectId.toLowerCase()) {
            return;
        }

        workspace.actions.updateWorkspaceConfig(activeWorkspaceId, {
            ...activeWorkspace.config,
            activeProjectId: project.projectId
        });
    }, [
        add,
        workspace.config,
        workspace.projectLoading,
        workspace.actions,
        workspace.workspaces,
        project,
        closeRef,
        loading
    ]);

    return (
        <div className={tabClassName}>
            <div className="project-tab-inner" role="button" onClick={handleTabClick}>
                <div className="tab-text">
                    {renderTabText}
                </div>
                {renderTabClose}
            </div>
        </div>
    );
}
