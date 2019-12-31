import React from 'react';
import WorkspaceContextProvider from '../../contexts/providers/WorkspaceContextProvider';
import WorkspaceComponent from './WorkspaceComponent';

export default function WorkspaceRootComponent() {
    return (
        <WorkspaceContextProvider>
            <WorkspaceComponent />
        </WorkspaceContextProvider>
    );
}
