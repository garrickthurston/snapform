import React from 'react';
import './PositionSelector.scss';

export default function PositionSelector({ transform, hoverClass }) {
    return (
        <svg className={`position-selector ${hoverClass}`}>
            <g>
                <rect width="8" height="8" transform={transform} />
            </g>
        </svg>
    );
}
