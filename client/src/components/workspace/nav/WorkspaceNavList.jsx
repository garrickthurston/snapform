import React, { useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNavList.scss';

export default function WorkspaceNavList({ activeWorkspace }) {
    const workspace = useWorkspace();
    const loading = workspace.workspaceLoading || workspace.projectLoading;
    const { workspaceId, projects, config } = activeWorkspace;
    const { activeProjectId, activeProjectTabs } = config;

    const handleProjectClick = useCallback((evt) => {
        if (loading) {
            return;
        }

        const { pid } = evt.target.dataset;

        const updatedConfig = {
            ...config,
            activeProjectId: pid,
            activeProjectTabs: [
                ...activeProjectTabs,
                ...(activeProjectTabs.indexOf(pid) === -1 ? [pid] : [])
            ]
        };

        workspace.actions.updateWorkspaceConfig(workspaceId, updatedConfig, true);
    }, [
        workspaceId,
        config,
        activeProjectTabs,
        workspace.actions,
        loading
    ]);

    const renderProjects = useMemo(() => {
        if (!activeWorkspace || !projects.length) {
            return (<li className="ws-project-item" />);
        }

        return projects.map((project) => {
            const tabOpen = activeProjectTabs && activeProjectTabs.find((x) => x.toLowerCase() === project.projectId.toLowerCase());
            const active = activeProjectId && activeProjectId.toLowerCase() === project.projectId.toLowerCase();

            return (
                <li
                    className={`ws-project-item ${active ? 'tab-active' : ''}`}
                    key={project.projectId}
                    data-pid={project.projectId}
                    onClick={handleProjectClick}
                    role="button"
                >
                    {tabOpen ? <FontAwesomeIcon icon={faCircle} data-pid={project.projectId} /> : null}
                    <span className="ws-project-item-text" data-pid={project.projectId}>{project.projectName}</span>
                </li>
            );
        });
    }, [
        activeWorkspace,
        projects,
        activeProjectId,
        activeProjectTabs,
        handleProjectClick
    ]);

    return (
        <ul className="workspace-nav-list">
            {renderProjects}
        </ul>
    );
}
