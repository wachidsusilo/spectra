import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ModalAuth.scss';
import Socket from './../../../socket/socket';

function ModalAuth({ openRef, onPasswordChange, idRef, onAuthorized }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState();
    const ref = useRef();

    const onDismiss = useCallback((e) => {
        if(e) e.preventDefault();
        if(e) e.stopPropagation();
        setOpen(false);
        if (error) setError(undefined);
    }, [error])

    useEffect(() => {
        if (openRef) openRef.current = setOpen;
        const input = ref.current;
        if(open) input.focus();
        const onkeydown = (e) => {
            if(e.key === 'Enter') {
                Socket.auth.authorize(idRef.current, ref.current.value).then((result) => {
                    if (result === 'granted') {
                        onDismiss();
                        ref.current.value = '';
                        if(onAuthorized) onAuthorized();
                    } else {
                        setError('incorrect password');
                    }
                }).catch((err) => {
                    setError(err);
                })
            } else if (e.key === 'Escape') {
                onDismiss(e);
            }
        }
        input.addEventListener('keydown', onkeydown);

        return () => {
            input.removeEventListener('keydown', onkeydown);
        }
    }, [setOpen, openRef, error, open, idRef, onAuthorized, onDismiss])

    const onClickNo = (e) => {
        onDismiss(e);
    }

    const onClickYes = (e) => {
        Socket.auth.authorize(idRef.current, ref.current.value).then((result) => {
            if (result === 'granted') {
                onDismiss();
                ref.current.value = '';
                if(onAuthorized) onAuthorized();
            } else {
                setError('incorrect password');
            }
        }).catch((err) => {
            setError(err);
        })
    }

    return (
        <div className={`modal-auth ${open ? '' : 'hide'}`}>
            <div className='modal-auth-overlay' onClick={onDismiss}></div>
            <div className='modal-auth-rect'>
                <div className='modal-auth-rect-input'>
                    <label htmlFor='modal-auth-password' className='modal-auth-rect-input-label'>Password</label>
                    <input ref={ref} id='modal-auth-password' className='modal-auth-rect-input-password' type='password' onChange={onPasswordChange} />
                    {error && <div className='modal-auth-rect-input-error'>{error}</div>}
                </div>
                <div className='modal-auth-rect-button'>
                    <div className='modal-auth-rect-button-no' onClick={onClickNo}>cancel</div>
                    <div className='modal-auth-rect-button-yes' onClick={onClickYes}>ok</div>
                </div>
            </div>
        </div>
    )
}

export default ModalAuth
