import React, { useCallback, useEffect, useRef, useState } from 'react'
import './ModalSave.scss'

function ModalSave({ onOk, onCancel, openSaveRef, onTitleChange, onDescriptionChange }) {
    const [open, setOpen] = useState(false);
    const titleRef = useRef();
    const descRef = useRef();

    const onDismiss = useCallback((e) => {
        if(e) e.preventDefault();
        if(e) e.stopPropagation();
        setOpen(false);
    }, []);

    useEffect(() => {
        const title = titleRef.current;
        const desc = descRef.current;

        if(open) {
            title.focus();
            title.select();
        }

        const onTitle = (e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                desc.focus();
                desc.select();
            } else if (e.key === 'Escape') {
                onDismiss(e);
            }
        }

        const onDescription = (e) => {
            if(e.key === 'Enter') {
                onDismiss(e);
                if (onOk) onOk();
            } else if (e.key === 'Escape') {
                onDismiss(e);
            }
        }

        if (openSaveRef) openSaveRef.current = setOpen;

        title.addEventListener('keydown', onTitle);
        desc.addEventListener('keydown', onDescription);

        return () => {
            title.removeEventListener('keydown', onTitle);
            desc.removeEventListener('keydown', onDescription);
        }
    }, [setOpen, openSaveRef, open, onDismiss, onOk])

    const onClickNo = (e) => {
        onDismiss(e);
        if (onCancel) onCancel();
    }

    const onClickYes = (e) => {
        onDismiss(e);
        if (onOk) onOk();
    }

    return (
        <div className={`modal-save ${open ? '' : 'hide'}`}>
            <div className='modal-save-overlay' onClick={onDismiss}></div>
            <div className='modal-save-rect'>
                <div className='modal-save-rect-input'>
                    <label htmlFor='modal-save-title' className='modal-save-rect-input-label'>Title</label>
                    <input ref={titleRef} id='modal-save-title' className='modal-save-rect-input-title' type='text' onChange={onTitleChange} />
                    <div />
                    <label htmlFor='modal-save-description' className='modal-save-rect-input-label'>Description</label>
                    <textarea ref={descRef} id='modal-save-description' className='modal-save-rect-input-description' type='text' onChange={onDescriptionChange} />
                </div>
                <div className='modal-save-rect-button'>
                    <div className='modal-save-rect-button-no' onClick={onClickNo}>cancel</div>
                    <div className='modal-save-rect-button-yes' onClick={onClickYes}>save</div>
                </div>
            </div>
        </div>
    )
}

export default ModalSave
