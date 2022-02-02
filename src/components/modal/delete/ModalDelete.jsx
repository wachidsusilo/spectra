import React, { useCallback, useEffect, useState } from 'react'
import './ModalDelete.scss'

function ModalDelete({ dataRef, onOk, onCancel, openRef }) {
    const [open, setOpen] = useState(false);

    const onDismiss = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
    },[])

    useEffect(() => {
        const onEscape = (e) => {
            if (e.key === 'Escape') {
                onDismiss(e);
            }
        }

        if(open) {
            window.addEventListener('keydown', onEscape);
        }

        if(openRef) openRef.current = setOpen;

        return () => {
            window.removeEventListener('keydown', onEscape);
        }
    }, [setOpen, openRef, open, onDismiss])

    const onClickNo = (e) => {
        onDismiss(e);
        if(onCancel) onCancel();
    }

    const onClickYes = (e) => {
        onDismiss(e);
        if(onOk) onOk();
    }

    return (
        <div className={`modal-delete ${open ? '' : 'hide'}`}>
            <div className='modal-delete-overlay' onClick={onDismiss}></div>
            <div className='modal-delete-rect'>
                <div className='modal-delete-rect-content'>
                    Please be careful when deleting data. This action can't be undone. Are you sure you want to delete "{dataRef.current ? dataRef.current.title : ''}" ? 
                </div>
                <div className='modal-delete-rect-button'>
                    <div className='modal-delete-rect-button-no' onClick={onClickNo}>cancel</div>
                    <div className='modal-delete-rect-button-yes' onClick={onClickYes}>delete</div>
                </div>
            </div>
        </div>
    )
}

export default ModalDelete
