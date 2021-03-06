import React, { useEffect } from 'react';
import { useModalBackdropContext } from 'contexts/ModalBackdropContext';


import './ModalBackdrop.scss';

const ModalBackdrop = ({ children }) => {

    const { contextDisplayModal, contextSetDisplayModal } = useModalBackdropContext();

    useEffect(() => {
        let marginRightPx = 0;
        if(window.getComputedStyle) {
            let bodyStyle = window.getComputedStyle(document.body);
            if(bodyStyle) {
                marginRightPx = parseInt(bodyStyle.marginRight, 10);
            }
        }

        let scrollbarWidthPx = window.innerWidth - document.body.clientWidth;

        Object.assign(document.body.style, {
            overflowY: 'hidden',
            paddingRight: `${marginRightPx + scrollbarWidthPx - 1}px`
        });

        return () => {
            Object.assign(document.body.style, {
                overflowY: 'scroll',
                paddingRight: 0
            });
        };
    }, []);

    const onModalBackdropClick = () => {
        // contextSetDisplayModal(false);
    }

    return (
        <div className="modal-backdrop" onClick={onModalBackdropClick}>
            <div className="modal-box">
                {children}
            </div>
        </div>
    )
};

export default ModalBackdrop;
