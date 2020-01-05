import React from 'react';
import Button from './Button';
import uiStrings from '../../ui-strings';
import './Prompt.scss';

export default function Prompt({
    icon,
    title,
    message,
    successText = uiStrings.ok,
    cancelText = uiStrings.cancel,
    singleButton,
    onSuccess,
    onClose,
    successBtnClassName
}) {
    const handleSuccessClick = () => {
        onSuccess && onSuccess();
        onClose(true);
    };

    return (
        <React.Fragment>
            <div className="graphic">{icon}</div>

            <h2>{title}</h2>
            <p>{message}</p>
            <div className="button-container">
                {!singleButton && <Button id="tp-dialog-prompt-cancel-btn" secondary onClick={() => onClose(null)}>{cancelText}</Button>}
                <Button id="tp-dialog-prompt-success-btn" onClick={handleSuccessClick} className={successBtnClassName}>{successText}</Button>
            </div>
        </React.Fragment>
    );
}
