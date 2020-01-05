import React, {
    useMemo,
    useEffect,
    useState,
    useCallback
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceNav.scss';
import WorkspaceNavList from './WorkspaceNavList';
import WorkspaceNavHeader from './WorkspaceNavHeader';

export default function WorkspaceNav() {
    const {
        workspaces,
        config,
        collapseAll,
        ...workspace
    } = useWorkspace();
    const [openWorkspaces, setOpenWorkspaces] = useState([]);
    const [openWorkspacesLoaded, setOpenWorkspacesLoaded] = useState(false);

    useEffect(() => {
        if (!workspaces.length || openWorkspacesLoaded) {
            return;
        }

        setOpenWorkspaces(workspaces.map((item) => item.workspaceId));
        setOpenWorkspacesLoaded(true);
    }, [
        workspaces,
        setOpenWorkspaces,
        openWorkspacesLoaded,
        setOpenWorkspacesLoaded
    ]);

    useEffect(() => {
        if (!workspaces.length || !collapseAll) {
            return;
        }

        setOpenWorkspaces([]);
    }, [workspaces, collapseAll, setOpenWorkspaces]);

    const handleWorkspaceHeaderClick = useCallback((evt) => {
        const { wsid } = evt.target.dataset;

        const ws = [
            ...openWorkspaces
        ];

        if (ws.indexOf(wsid) > -1) {
            ws.splice(ws.indexOf(wsid), 1);
        } else {
            ws.push(wsid);
        }

        workspace.actions.collapseAll(false);
        setOpenWorkspaces(ws);
    }, [openWorkspaces, setOpenWorkspaces, workspace.actions]);

    const renderWorkspaces = useMemo(() => {
        if (!workspaces.length) {
            return (<li className="ws-item" />);
        }

        return workspaces.map((item) => {
            const { workspaceId, workspaceName } = item;
            const wsActive = openWorkspaces.indexOf(workspaceId) > -1;

            const workspaceActive = !!config
                && !!config.activeWorkspaceId
                && config.activeWorkspaceId.toLowerCase() === workspaceId.toLowerCase();

            return (
                <li className={`ws-item ${workspaceActive ? 'ws-active' : ''}`} key={workspaceId} data-wsid={workspaceId}>
                    <div className="ws-item-header" onClick={handleWorkspaceHeaderClick} data-wsid={workspaceId} role="button">
                        <FontAwesomeIcon icon={wsActive ? faChevronDown : faChevronRight} data-wsid={workspaceId} />
                        <span className="workspace-name" data-wsid={workspaceId}>{workspaceName}</span>
                    </div>
                    {wsActive && <WorkspaceNavList activeWorkspace={item} />}
                </li>
            );
        });
    }, [workspaces, config, openWorkspaces, handleWorkspaceHeaderClick]);

    return (
        <div className="ws-nav">
            <div className="ws-nav-header">
                <WorkspaceNavHeader />
            </div>
            <div className="ws-root-nav">
                <ul className="ws-root-nav-list">
                    {renderWorkspaces}
                </ul>
            </div>
        </div>
    );
}
