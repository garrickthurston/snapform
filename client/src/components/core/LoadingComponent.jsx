import React from 'react';
import './LoadingComponent.scss';

const _loadingClassName = 'loading-pulse';
export default function LoadingComponent({ fullScreen }) {
    const pulseClassName = `${_loadingClassName} ${fullScreen ? 'full-screen' : ''}`;

    return (
        <div className={pulseClassName}>
            <div className="loading-pulse-icon">
                <div className="spinner">
                    <div className="double-bounce1" />
                    <div className="double-bounce2" />
                </div>
            </div>
        </div>
    );
}
