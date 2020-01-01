import React, { useMemo } from 'react';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNav.scss';
import WorkspaceNavList from './WorkspaceNavList';

export default function WorkspaceNav() {
    const workspace = useWorkspace();

    const renderWorkspaces = useMemo(() => {
        const { workspaces = [] } = workspace;

        return workspaces.map((item) => {
            const { projects } = item;

            return (
                <li key={item.workspaceId}>
                    {item.workspaceName}
                    {projects ? <WorkspaceNavList workspaceId={item.workspaceId} /> : null}
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
