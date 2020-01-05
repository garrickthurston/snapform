import React, { useMemo, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import useModal from '../../../hooks/useModal';
import './WorkspaceNavList.scss';

export default function WorkspaceNavList({ currentWorkspace, active }) {
    const workspace = useWorkspace();
    const { ModalRoot, promptDelete } = useModal();
    const loading = workspace.workspaceLoading || workspace.projectLoading;
    const { workspaceId, projects, config } = currentWorkspace;
    const { activeProjectId, activeProjectTabs } = config;
    const [hovering, setHovering] = useState(null);

    const handleProjectClick = useCallback((evt) => {
        if (loading) {
            return;
        }

        const { pid } = evt.target.dataset;

        const updatedConfig = {
            ...config,
            activeProjectId: pid,
            activeProjectTabs: [
                ...activeProjectTabs,
                ...(activeProjectTabs.map((item) => item.toLowerCase()).indexOf(pid.toLowerCase()) === -1 ? [pid] : [])
            ]
        };

        workspace.actions.updateWorkspaceConfig(workspaceId, updatedConfig, true);
    }, [
        workspaceId,
        config,
        activeProjectTabs,
        workspace.actions,
        loading
    ]);

    const handleMouseEnter = useCallback((evt) => {
        if (loading) {
            return;
        }

        const { pid } = evt.target.dataset;

        setHovering(pid);
    }, [setHovering, loading]);

    const handleMouseLeave = useCallback(() => {
        setHovering(null);
    }, [setHovering]);

    const renderProjects = useMemo(() => {
        if (!currentWorkspace || !projects.length) {
            return (<li className="ws-project-item" />);
        }

        return projects.map((project) => {
            const tabOpen = active && activeProjectTabs && activeProjectTabs.find((x) => x.toLowerCase() === project.projectId.toLowerCase());
            const tabActive = active && activeProjectId && activeProjectId.toLowerCase() === project.projectId.toLowerCase();

            const removeProject = (evt) => {
                evt.stopPropagation();
                evt.preventDefault();

                if (loading) {
                    return;
                }

                const { projectId } = project;

                if (currentWorkspace.workspaceId && projectId) {
                    promptDelete().then(() => workspace.actions.deleteProject(currentWorkspace.workspaceId, projectId));
                }
            };

            const renderHoverActions = () => {
                if (hovering !== project.projectId) {
                    return null;
                }

                return (
                    <button className="remove-project" onClick={removeProject}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                );
            };

            return (
                <li
                    className={`ws-project-item ${tabActive ? 'tab-active' : ''}`}
                    key={project.projectId}
                    data-pid={project.projectId}
                    onClick={handleProjectClick}
                    role="button"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {tabOpen ? <FontAwesomeIcon icon={faCircle} data-pid={project.projectId} /> : null}
                    <div data-pid={project.projectId} className="ws-project-item-text">
                        <span data-pid={project.projectId}>{project.projectName}</span>
                    </div>
                    {renderHoverActions()}
                </li>
            );
        });
    }, [
        currentWorkspace,
        projects,
        activeProjectId,
        activeProjectTabs,
        handleProjectClick,
        handleMouseEnter,
        handleMouseLeave,
        hovering,
        promptDelete,
        loading,
        workspace.actions,
        active
    ]);

    return (
        <React.Fragment>
            <ul className="workspace-nav-list">
                {renderProjects}
            </ul>
            <ModalRoot />
        </React.Fragment>
    );
}
