import React, { useCallback, useEffect, useRef, useState } from 'react'
import './ModalDownload.scss'

function ModalDownload({ openDownloadRef, onOk, titleRef }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState();
    const ref = useRef();

    const onDismiss = useCallback((e) => {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        setOpen(false);
        if (error) setError(undefined);
    }, [error])

    useEffect(() => {
        const input = ref.current;
        if (open) {
            if (titleRef && titleRef.current) input.value = titleRef.current;
            input.focus();
            input.select();
        }

        const onkeydown = (e) => {
            if (e.key === 'Enter') {
                if (input.value === '') {
                    setError('Title cannot be empty');
                } else {
                    onDismiss(e);
                    if (onOk) onOk(input.value);
                }
            } else if (e.key === 'Escape') {
                onDismiss(e);
            }
        }

        input.addEventListener('keydown', onkeydown);
        if (openDownloadRef) openDownloadRef.current = setOpen;

        return () => {
            input.removeEventListener('keydown', onkeydown);
        }
    }, [setOpen, openDownloadRef, error, open, onDismiss, onOk, titleRef])

    const onClickNo = (e) => {
        onDismiss(e);
    }

    const onClickYes = (e) => {
        if (ref.current.value === '') {
            setError('Title cannot be empty');
        } else {
            onDismiss(e);
            if (onOk) onOk(ref.current.value);
        }
    }

    return (
        <div className={`modal-download ${open ? '' : 'hide'}`}>
            <div className='modal-download-overlay' onClick={onDismiss}></div>
            <div className='modal-download-rect'>
                <div className='modal-download-rect-input'>
                    <label htmlFor='modal-download-title' className='modal-download-rect-input-label'>Filename</label>
                    <div className='modal-download-rect-input-container'>
                        <input ref={ref} id='modal-download-title' className='modal-download-rect-input-container-title' type='title' />
                        <div className='modal-download-rect-input-container-extension'>.csv</div>
                    </div>
                    {error && <div className='modal-download-rect-input-error'>{error}</div>}
                </div>
                <div className='modal-download-rect-button'>
                    <div className='modal-download-rect-button-no' onClick={onClickNo}>cancel</div>
                    <div className='modal-download-rect-button-yes' onClick={onClickYes}>download</div>
                </div>
            </div>
        </div>
    )
}

export default ModalDownload
