import React from 'react';
import './Button.scss';

export default function Button(props) {
    const {
        loading,
        secondary,
        small,
        onClick,
        className,
        id,
        type,
        disabled,
        children
    } = props;

    const secondaryClassName = secondary ? ' sf-btn-secondary' : ' sf-btn-primary';
    const loadingClassName = loading ? ' sf-btn-loading' : '';
    const sizeClassName = small ? ' sf-btn-sm' : '';

    /* eslint-disable react/button-has-type */
    return (
        <button
            className={`sf-btn${sizeClassName}${loadingClassName}${secondaryClassName} ${className || ''}`.trim()}
            onClick={onClick}
            id={id}
            type={type || 'button'}
            disabled={disabled || false}
        >
            {loading ? <span className="btn-loading-content pulsating-circle" /> : children}
        </button>
    );
    /* eslint-enable react/button-has-type */
}
