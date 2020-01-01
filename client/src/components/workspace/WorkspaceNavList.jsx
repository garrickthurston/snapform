import React from 'react';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNavList.scss';

export default function WorkspaceNavList({ workspaceId }) {
    const workspace = useWorkspace();
    const { projects } = (workspace && workspace.workspaces && workspace.workspaces.find((x) => x.workspaceId === workspaceId)) || {};

    return (
        <div className="workspace-nav-list">
            <ul>
                {projects.map((project) => (
                    <li key={project.projectId}>{project.projectName}</li>
                ))}
            </ul>
        </div>
    );
}
