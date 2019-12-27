import React, { useState, useCallback, useMemo } from 'react';
import './TextInput.scss';

export default function TextInput({
    id,
    placeholder,
    label,
    groupClassName,
    disabled,
    error,
    innerRef,
    onChange,
    className,
    value,
    type
}) {
    const [focus, setFocus] = useState(false);

    const onChanged = useCallback((event) => {
        const newValue = event.target && event.target.value;
        onChange && onChange(event, { newValue });
    }, [onChange]);

    const onFocus = useCallback(() => {
        setFocus(true);
    }, []);

    const onBlur = useCallback(() => {
        setFocus(false);
    }, []);

    const getInputClassName = useMemo(() => {
        let inputClassName = `${className || ''} sf-form-control ${value ? 'value' : ''} ${focus ? 'focus' : ''}`;
        if (error) {
            inputClassName += ' invalid';
        }

        return inputClassName;
    }, [className, value, focus, error]);

    const placeholderClassName = placeholder ? 'with-placeholder' : '';
    const placeholderThemeStyle = {};
    const inputThemeStyle = {};

    return (
        <div className={`sf-form-group ${groupClassName || ''} ${placeholderClassName}`.trim()}>
            {label ? <label id={`${id}-label`} htmlFor={id}>{label}</label> : null}
            <input
                className={getInputClassName}
                type={type || 'text'}
                value={value}
                onChange={onChanged}
                disabled={disabled}
                onFocus={onFocus}
                onBlur={onBlur}
                style={inputThemeStyle}
                aria-invalid={!!error}
                ref={innerRef}
            />
            {placeholder ? <span className="placeholder" style={placeholderThemeStyle}>{placeholder}</span> : null}
        </div>
    );
}
