import React, { useMemo } from 'react';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNavComponent.scss';

export default function WorkspaceNavComponent() {
    const workspace = useWorkspace();

    const renderWorkspaces = useMemo(() => {
        const { workspaces = [] } = workspace;

        return workspaces.map((item) => {
            const { projects } = item;

            const renderProjects = () => {
                if (projects.length) {
                    return (
                        <ul>
                            {projects.map((project) => (
                                <li key={project.projectId}>{project.projectName}</li>
                            ))}
                        </ul>
                    );
                }

                return null;
            };

            return (
                <li key={item.workspaceId}>
                    {item.workspaceName}
                    {renderProjects()}
                </li>
            );
        });
    }, [workspace]);

    return (
        <ul className="ws-root-nav">
            {renderWorkspaces}
        </ul>
    );
}
