import React, { useMemo } from 'react';
import ProjectTab from './editor/ProjectTab';
import './WorkspaceTabs.scss';

export default function WorkspaceTabs({ activeWorkspace }) {
    const renderTabs = useMemo(() => {
        if (activeWorkspace && activeWorkspace.config && activeWorkspace.config.activeProjectTabs) {
            return activeWorkspace.config.activeProjectTabs.map((projectId) => {
                const project = activeWorkspace.projects.find((x) => x.projectId.toLowerCase() === projectId.toLowerCase());
                return (
                    <ProjectTab
                        key={projectId}
                        project={project}
                        active={activeWorkspace.config.activeProjectTabs.length === 1 || activeWorkspace.config.activeProjectId.toLowerCase() === projectId.toLowerCase()}
                    />
                );
            });
        }

        return null;
    }, [activeWorkspace]);

    return (
        <div className="project-tabs-container">
            <div className="project-tabs">
                {renderTabs}
                <ProjectTab add />
            </div>
        </div>
    );
}
