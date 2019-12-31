import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import uiStrings from '../../../ui-strings';
import './TabComponent.scss';

const _tabClassName = 'project-tab-outer';
export default function TabComponent({ project, active, add }) {
    const tabClassName = `${_tabClassName} ${(project && project.active) || active ? 'active' : ''} ${add ? 'add' : ''}`;

    return (
        <div className={tabClassName}>
            <div className="project-tab-inner" role="button">
                {(project && project.projectName) || (add ? <FontAwesomeIcon icon={faPlus} /> : null) || uiStrings.untitledProject}
            </div>
        </div>
    );
}
