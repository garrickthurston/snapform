import React from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceHeaderComponent from './WorkspaceHeaderComponent';
import WorkspaceNavComponent from './WorkspaceNavComponent';
import WorkspaceTabsComponent from './WorkspaceTabsComponent';
import GridComponent from './core/GridComponent';
import './WorkspaceComponent.scss';

export default function WorkspaceComponent() {
    // eslint-disable-next-line no-unused-vars
    const params = useParams();

    return (
        <div className="workspace-container">
            <div className="workspace">
                <div className="workspace-head">
                    <WorkspaceHeaderComponent />
                </div>
                <div className="workspace-body">
                    <div className="workspace-nav">
                        <WorkspaceNavComponent />
                    </div>
                    <div className="workspace-editor">
                        <div className="workspace-tabs">
                            <WorkspaceTabsComponent />
                        </div>
                        <div className="workspace-editor-body">
                            <GridComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
