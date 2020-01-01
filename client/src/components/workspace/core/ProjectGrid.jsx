import React, { useRef, useState, useCallback } from 'react';
import PositionSelector from './PositionSelector';
import './ProjectGrid.scss';

const _defaultCellWidth = 8;
const _defaultLargeCallWidth = _defaultCellWidth * 10;

export default function ProjectGrid({ loading }) {
    const gridRef = useRef(null);
    const [positionSelectorTransform, setPositionSelectorTransform] = useState(null);
    const [positionSelectorClassName, setPositionSelectorClassName] = useState('hidden');

    const handleGridMouseEnter = useCallback(() => {
        if (loading) {
            return;
        }

        setPositionSelectorClassName('');
    }, [loading]);
    const handleGridMouseExit = useCallback(() => {
        if (loading) {
            return;
        }

        setPositionSelectorClassName('hidden');
    }, [loading]);
    const handleGridMouseMove = useCallback((evt) => {
        if (loading) {
            return;
        }
        const { offsetX, offsetY } = evt.nativeEvent;

        const x = Math.floor(offsetX / _defaultCellWidth) * _defaultCellWidth;
        const y = Math.floor(offsetY / _defaultCellWidth) * _defaultCellWidth;

        setPositionSelectorTransform(`translate(${x},${y})`);
    }, [loading]);

    return (
        <div className="sf-grid-bg" onMouseMove={handleGridMouseMove} onMouseEnter={handleGridMouseEnter} onMouseLeave={handleGridMouseExit}>
            <svg className="sf-grid-bg-svg" ref={gridRef} width="100%" height="100%">
                <defs>
                    <pattern id="smallGrid" width={_defaultCellWidth} height={_defaultCellWidth} patternUnits="userSpaceOnUse">
                        <path d={`M ${_defaultCellWidth} 0 L 0 0 0 ${_defaultCellWidth}`} fill="none" stroke="gray" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="largeGrid" width={_defaultLargeCallWidth} height={_defaultLargeCallWidth} patternUnits="userSpaceOnUse">
                        <rect width={_defaultLargeCallWidth} height={_defaultLargeCallWidth} fill="url(#smallGrid)" />
                        <path d={`M ${_defaultLargeCallWidth} 0 L 0 0 0 ${_defaultLargeCallWidth}`} fill="none" stroke="gray" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#largeGrid)" />
            </svg>
            <div className="grid-children">
                <PositionSelector transform={positionSelectorTransform} hoverClass={positionSelectorClassName} />
            </div>
        </div>
    );
}
