import React, { useMemo, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import uiStrings from '../../../ui-strings';
import './TabComponent.scss';

const _tabClassName = 'project-tab-outer';
export default function TabComponent({ project, active, add }) {
    const workspace = useWorkspace();
    const loading = workspace.workspaceLoading || workspace.projectLoading;
    const tabClassName = `${_tabClassName} ${(project && project.active) || active ? 'active' : ''} ${add ? 'add' : ''}`;
    const closeRef = useRef(null);

    const closeTab = useCallback(() => {
        if (loading) {
            return;
        }

        workspace.actions.setProjectTabStatus(project.projectId, false);
    }, [workspace.actions, project, loading]);

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
            <button className="tab-close" onClick={closeTab} ref={closeRef}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        );
    }, [add, closeTab]);

    const handleTabClick = useCallback((evt) => {
        if (loading) {
            return;
        }

        if (add && !workspace.projectLoading) {
            const { workspaceId } = workspace.workspace;
            workspace.actions.initiateProject(workspaceId);
            return;
        }

        if (closeRef && closeRef.current && closeRef.current.contains(evt.target)) {
            return;
        }

        workspace.actions.setProjectActive(project.projectId);
    }, [
        add,
        workspace.projectLoading,
        workspace.workspace,
        workspace.actions,
        project,
        closeRef,
        loading
    ]);

    return (
        <div className={tabClassName}>
            <div className="project-tab-inner" role="button" onClick={handleTabClick}>
                <div className="tab-text">
                    {renderTabText}
                </div>
                {renderTabClose}
            </div>
        </div>
    );
}
