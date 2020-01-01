import React from 'react';
import WorkspaceContextProvider from '../../contexts/providers/WorkspaceContextProvider';
import Workspace from './Workspace';

export default function WorkspaceRoot() {
    return (
        <WorkspaceContextProvider>
            <Workspace />
        </WorkspaceContextProvider>
    );
}
