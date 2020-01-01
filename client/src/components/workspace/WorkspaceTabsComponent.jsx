import React, { useMemo } from 'react';
import TabComponent from './core/TabComponent';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceTabsComponent.scss';

export default function WorkspaceTabsComponent() {
    const workspace = useWorkspace();

    const renderTabs = useMemo(() => {
        if (workspace.workspace) {
            const { projects } = workspace.workspace;
            const activeProjects = projects.filter((project) => project.tabStatus);
            return activeProjects.map((project) => (<TabComponent key={project.projectId} project={project} active={activeProjects.length === 1 || project.active} />));
        }

        return (<TabComponent empty active />);
    }, [workspace.workspace]);

    return (
        <div className="project-tabs">
            {renderTabs}
            <TabComponent add />
        </div>
    );
}
