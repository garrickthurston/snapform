import React, { useState } from 'react';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import uiStrings from '../../ui-strings';
import './WorkspaceHeaderComponent.scss';

export default function WorkspaceHeaderComponent() {
    const workspace = useWorkspace();
    const [workspaceTitle] = useState((workspace && workspace.workspaceName) || uiStrings.untitledWorkspace);

    return (
        <div className="workspace-header">
            <div className="title-default">
                <h4>{workspaceTitle}</h4>
            </div>
        </div>
    );
}
