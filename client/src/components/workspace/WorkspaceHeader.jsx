import React, { useMemo } from 'react';
import './WorkspaceHeader.scss';

export default function WorkspaceHeader({ activeWorkspace }) {
    const renderWorkspaceName = useMemo(() => (activeWorkspace && activeWorkspace.workspaceName) || '', [activeWorkspace]);

    return (
        <div className="workspace-header">
            <div className="title-default">
                <h4>{renderWorkspaceName}</h4>
            </div>
        </div>
    );
}
