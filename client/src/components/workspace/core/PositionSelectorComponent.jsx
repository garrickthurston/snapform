import React from 'react';
import './PositionSelectorComponent.scss';

export default function PositionSelectorComponent({ transform, hoverClass }) {
    return (
        <svg className={`position-selector ${hoverClass}`}>
            <g>
                <rect width="8" height="8" transform={transform} />
            </g>
        </svg>
    );
}
