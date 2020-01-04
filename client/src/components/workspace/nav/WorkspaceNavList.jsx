import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import './WorkspaceNavList.scss';

export default function WorkspaceNavList({ activeWorkspace }) {
    const renderProjects = useMemo(() => {
        if (!activeWorkspace) {
            return (<li className="ws-project-item" />);
        }

        return activeWorkspace.projects.map((project) => {
            const { activeProjectTabs, activeProjectId } = activeWorkspace.config;
            const tabOpen = activeProjectTabs && activeProjectTabs.find((x) => x.toLowerCase() === project.projectId.toLowerCase());
            const active = activeProjectId && activeProjectId.toLowerCase() === project.projectId.toLowerCase();

            return (
                <li className={`ws-project-item ${active ? 'tab-active' : ''}`} key={project.projectId}>
                    {tabOpen ? <FontAwesomeIcon icon={faCircle} /> : null}
                    <span className="ws-project-item-text">{project.projectName}</span>
                </li>
            );
        });
    }, [activeWorkspace]);

    return (
        <ul className="workspace-nav-list">
            {renderProjects}
        </ul>
    );
}
