import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import uiStrings from '../../../ui-strings';
import './WorkspaceNavHeader.scss';

export default function WorkspaceNavHeader() {
    return (
        <div className="workspace-nav-header">
            <span className="header-text">{uiStrings.workspaces}</span>
            <div className="header-actions">
                <button className="add-workspace">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <button className="collapse-workspaces">
                    <FontAwesomeIcon icon={faChevronUp} />
                </button>
            </div>
        </div>
    );
}
