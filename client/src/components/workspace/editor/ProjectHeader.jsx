import React, { useMemo } from 'react';
import './ProjectHeader.scss';

export default function ProjectHeader({ project }) {
    const renderWorkspaceName = useMemo(() => (project && project.projectName) || '', [project]);

    return (
        <div className="project-header">
            <h5 className="project-title">{renderWorkspaceName}</h5>
        </div>
    );
}
