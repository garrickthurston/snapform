import React, { useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import uiStrings from '../../../ui-strings';
import './TabComponent.scss';

const _tabClassName = 'project-tab-outer';
export default function TabComponent({ project, active, add }) {
    const workspace = useWorkspace();
    const tabClassName = `${_tabClassName} ${(project && project.active) || active ? 'active' : ''} ${add ? 'add' : ''}`;

    const closeTab = useCallback(() => {
        workspace.actions.setProjectTabActive(project.projectId, false);
    }, [workspace.actions, project]);

    const renderTabText = useMemo(() => {
        if (project) { return project.projectName; }
        if (add) { return (<FontAwesomeIcon icon={faPlus} />); }

        return uiStrings.untitledProject;
    }, [project, add]);

    const renderTabClose = useMemo(() => {
        if (add) {
            return null;
        }

        return (
            <button className="tab-close" onClick={closeTab}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        );
    }, [add, closeTab]);

    return (
        <div className={tabClassName}>
            <div className="project-tab-inner" role="button">
                <div className="tab-text">
                    {renderTabText}
                </div>
                {renderTabClose}
            </div>
        </div>
    );
}
