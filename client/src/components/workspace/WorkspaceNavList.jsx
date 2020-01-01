import React, { useMemo } from 'react';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNavList.scss';

export default function WorkspaceNavList({ workspaceId }) {
    const workspace = useWorkspace();
    const { projects } = (workspace && workspace.workspaces && workspace.workspaces.find((x) => x.workspaceId === workspaceId)) || {};

    const renderProjects = useMemo(() => (projects.map((project) => (
        <li className="ws-project-item" key={project.projectId}>
            <span>{project.projectName}</span>
        </li>
    ))), [projects]);

    return (
        <ul className="workspace-nav-list">
            {renderProjects}
        </ul>
    );
}
