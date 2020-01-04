import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNav.scss';
import WorkspaceNavList from './WorkspaceNavList';
import WorkspaceNavHeader from './WorkspaceNavHeader';

export default function WorkspaceNav() {
    const { workspaces } = useWorkspace();

    const renderWorkspaces = useMemo(() => {
        if (!workspaces.length) {
            return (<li className="ws-item" />);
        }

        return workspaces.map((item) => (
            <li className="ws-item" key={item.workspaceId}>
                <div className="ws-item-header">
                    <FontAwesomeIcon icon={faChevronDown} />
                    <span className="workspace-name">{item.workspaceName}</span>
                </div>
                <WorkspaceNavList activeWorkspace={item} />
            </li>
        ));
    }, [workspaces]);

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
