import React, { useRef, useState } from 'react';
import PositionSelectorComponent from './PositionSelectorComponent';
import './GridComponent.scss';

export default function GridComponent() {
    const gridRef = useRef(null);
    const [positionSelectorTransform, setPositionSelectorTransform] = useState(null);
    const [positionSelectorClassName, setPositionSelectorClassName] = useState('hidden');

    const handleGridMouseEnter = () => {
        setPositionSelectorClassName('');
    };
    const handleGridMouseExit = () => {
        setPositionSelectorClassName('hidden');
    };
    const handleGridMouseMove = (evt) => {
        const { offsetX, offsetY } = evt.nativeEvent;

        const x = Math.floor(offsetX / 8) * 8;
        const y = Math.floor(offsetY / 8) * 8;

        setPositionSelectorTransform(`translate(${x},${y})`);
    };

    return (
        <div className="sf-grid-bg" onMouseMove={handleGridMouseMove} onMouseEnter={handleGridMouseEnter} onMouseLeave={handleGridMouseExit}>
            <svg className="sf-grid-bg-svg" ref={gridRef} width="100%" height="100%">
                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="largeGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)" />
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#largeGrid)" />
            </svg>
            <div className="grid-children">
                <PositionSelectorComponent transform={positionSelectorTransform} hoverClass={positionSelectorClassName} />
            </div>
        </div>
    );
}
