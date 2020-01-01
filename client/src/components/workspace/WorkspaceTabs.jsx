import React, { useMemo } from 'react';
import ProjectTab from './core/ProjectTab';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceTabs.scss';

export default function WorkspaceTabs() {
    const workspace = useWorkspace();

    const renderTabs = useMemo(() => {
        if (workspace.workspace) {
            const { projects } = workspace.workspace;
            const activeProjects = projects.filter((project) => project.tabStatus);
            return activeProjects.map((project) => (<ProjectTab key={project.projectId} project={project} active={activeProjects.length === 1 || project.active} />));
        }

        return (<ProjectTab empty active />);
    }, [workspace.workspace]);

    return (
        <div className="project-tabs">
            {renderTabs}
            <ProjectTab add />
        </div>
    );
}
