import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import Prompt from '../components/core/Prompt';
import uiStrings from '../ui-strings';

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.6)';
Modal.defaultStyles.overlay.zIndex = '1111';
Modal.defaultStyles.overlay.justifyContent = 'center';
Modal.defaultStyles.overlay.alignItems = 'center';
Modal.defaultStyles.overlay.display = 'flex';

Modal.defaultStyles.content.backgroundColor = 'transparent';
Modal.defaultStyles.content.position = 'relative';
Modal.defaultStyles.content.left = '0';
Modal.defaultStyles.content.top = '0';
Modal.defaultStyles.content.bottom = '0';
Modal.defaultStyles.content.right = '0';
Modal.defaultStyles.content.padding = '30px';
Modal.defaultStyles.content.border = 'none';

Modal.setAppElement('body');

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState({});

    const modalRoot = useCallback(() => {
        const {
            component: ModalComponent,
            props: modalProps,
            handleClose,
            type
        } = activeModal;
        if (ModalComponent == null) return null;

        const customStyles = { content: {} };
        if (ModalComponent.width) customStyles.content.width = ModalComponent.width;

        return (
            <Modal isOpen={isOpen} style={customStyles} closeTimeoutMS={300}>
                <div id={`sf-dialog.${type}`} className={`sf-dialog ${type} ${ModalComponent.className || ''}`.trimRight()}>
                    <button className="sf-dialog-close" id="dialog-close-btn" onClick={() => handleClose(null)}><span>&#10006;</span></button>
                    <ModalComponent {...modalProps} onClose={handleClose} />
                </div>
            </Modal>
        );
    }, [isOpen, activeModal]);

    const openModal = useCallback((component, componentProps, type = 'creator-editor') => new Promise((resolve) => {
        const modal = {
            component,
            props: componentProps,
            type,
            handleClose: (result) => {
                setIsOpen(false);
                setTimeout(() => {
                    setActiveModal({});
                    resolve(result);
                }, 100);
            }
        };

        setActiveModal(modal);
        setTimeout(() => setIsOpen(true), 100);
    }), []);

    const closeModal = useCallback(() => {
        activeModal.handleClose(null);
    }, [activeModal]);

    const openPrompt = useCallback(({
        icon = 'fa-info-circle',
        title,
        message,
        successText,
        cancelText,
        singleButton = false,
        onSuccess
    }) => {
        let iconDisplay = icon;

        if (typeof icon === 'string' || icon instanceof String) {
            iconDisplay = <span className={`fa partner-color ${icon}`} aria-hidden="true" />;
        }

        return new Promise((resolve, reject) => {
            openModal(
                Prompt,
                {
                    icon: iconDisplay,
                    title,
                    message,
                    successText,
                    cancelText,
                    singleButton: !cancelText && singleButton,
                    onSuccess
                },
                'prompt'
            ).then((result) => {
                if (result) resolve(result);
                else reject();
            });
        });
    }, [openModal]);

    const promptDelete = useCallback(() => openPrompt({
        message: uiStrings.deleteItemPromptMessage,
        title: uiStrings.deleteItemTitleMessage,
        successText: uiStrings.delete
    }), [openPrompt]);

    return {
        ModalRoot: modalRoot,
        openModal,
        closeModal,
        openPrompt,
        promptDelete
    };
};

export default useModal;
