import React, {
    useMemo,
    useState,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../../contexts/providers/WorkspaceContextProvider';
import './WorkspaceDebugComponent.scss';

const _jsonSyntaxFormat = (json) => {
    let formattedJson = json;
    if (typeof formattedJson !== 'string') {
        formattedJson = JSON.stringify(json, undefined, 2);
    }
    formattedJson = formattedJson.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return formattedJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return `<span class=${cls}>${match}</span>`;
    });
};

export default function WorkspaceDebugComponent() {
    const { workspace } = useWorkspace();
    const [debugWindowOpen, setDebugWindowOpen] = useState(false);
    const windowRef = useRef(null);

    const handleClickOutside = (evt) => {
        if (windowRef.current && windowRef.current.contains(evt.target)) {
            return;
        }

        setDebugWindowOpen(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const handleDebugAnchorClick = useCallback(() => {
        setDebugWindowOpen(!debugWindowOpen);
    }, [debugWindowOpen]);

    const renderWorkspaceJson = useMemo(() => {
        if (debugWindowOpen && workspace) {
            // eslint-disable-next-line react/no-danger
            return (<pre ref={windowRef} className="workspace-debug-window" dangerouslySetInnerHTML={{ __html: _jsonSyntaxFormat(workspace) }} />);
        }

        return null;
    }, [debugWindowOpen, workspace]);

    return (
        <div className="workspace-debug-container">
            {renderWorkspaceJson}
            <button className="workspace-debug-anchor" onClick={handleDebugAnchorClick}>
                <FontAwesomeIcon icon={faBug} />
            </button>
        </div>
    );
}
