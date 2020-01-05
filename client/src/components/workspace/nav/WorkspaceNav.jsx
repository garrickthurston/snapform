import React, { useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNav.scss';
import WorkspaceNavList from './WorkspaceNavList';
import WorkspaceNavHeader from './WorkspaceNavHeader';

export default function WorkspaceNav() {
    const { workspaces, config, ...workspace } = useWorkspace();

    const handleWorkspaceHeaderClick = useCallback((evt) => {
        const { wsid } = evt.target.dataset;

        const ws = workspaces.find((item) => item.workspaceId.toLowerCase() === wsid.toLowerCase());
        workspace.actions.updateWorkspaceCollapsed(wsid, !ws.collapsed);
    }, [
        workspaces,
        workspace.actions
    ]);

    const renderWorkspaces = useMemo(() => {
        if (!workspaces || !workspaces.length) {
            return (<li className="ws-item" />);
        }

        return workspaces.map((item) => {
            const { workspaceId, workspaceName, collapsed } = item;

            const workspaceActive = !!config
                && !!config.activeWorkspaceId
                && config.activeWorkspaceId.toLowerCase() === workspaceId.toLowerCase();

            return (
                <li className={`ws-item ${workspaceActive ? 'ws-active' : ''}`} key={workspaceId} data-wsid={workspaceId}>
                    <div className="ws-item-header" onClick={handleWorkspaceHeaderClick} data-wsid={workspaceId} role="button">
                        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} data-wsid={workspaceId} />
                        <span className="workspace-name" data-wsid={workspaceId}>{workspaceName}</span>
                    </div>
                    {!collapsed && <WorkspaceNavList active={workspaceActive} currentWorkspace={item} />}
                </li>
            );
        });
    }, [workspaces, config, handleWorkspaceHeaderClick]);

    return (
        <div className="ws-nav">
            <div className="ws-nav-header">
                <WorkspaceNavHeader />
            </div>
            <div className="ws-root-nav">
                <ul className="ws-root-nav-list">
                    {renderWorkspaces}
                </ul>
            </div>
        </div>
    );
}
