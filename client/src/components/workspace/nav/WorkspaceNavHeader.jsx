import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import uiStrings from '../../../ui-strings';
import './WorkspaceNavHeader.scss';

export default function WorkspaceNavHeader() {
    const workspace = useWorkspace();

    const handleCollapseAllClick = useCallback(() => workspace.actions.collapseAll(), [workspace.actions]);

    const handleAddWorkspaceClick = useCallback(() => workspace.actions.initiateWorkspace(), [workspace.actions]);

    return (
        <div className="workspace-nav-header">
            <div className="workspace-nav-header-text">
                <span className="header-text">{uiStrings.workspaces}</span>
            </div>
            <div className="header-actions">
                <button className="add-workspace" onClick={handleAddWorkspaceClick}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <button className="collapse-workspaces" onClick={handleCollapseAllClick}>
                    <FontAwesomeIcon icon={faChevronUp} />
                </button>
            </div>
        </div>
    );
}
