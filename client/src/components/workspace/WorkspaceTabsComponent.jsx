import React, { useMemo } from 'react';
import TabComponent from './core/TabComponent';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceTabsComponent.scss';

export default function WorkspaceTabsComponent() {
    const workspace = useWorkspace();

    const renderTabs = useMemo(() => {
        if (workspace.workspace) {
            const { projects } = workspace.workspace;
            return projects.map((project) => (<TabComponent key={project.projectId} project={project} active={projects.length === 1} />));
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
