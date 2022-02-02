import React, { useEffect, useState } from 'react'
import './Navigation.scss'
import ButtonNav from './../button/NavButton';
import NavContent from './../content/NavContent';

function Navigation({ action, historyType, bodyRef, navRef, onOpen, onDelete }) {
    const [showNav, setShowNav] = useState();

    useEffect(() => {
        const onEscape = (e) => {
            if(e.key === 'Escape') {
                setShowNav(false);
            }
        }

        if(showNav) window.addEventListener('keydown', onEscape);

        return () => {
            window.removeEventListener('keydown', onEscape);
        }
    }, [showNav])

    return (
        <div className='navigation'>
            <NavContent action={action} historyType={historyType} bodyRef={bodyRef} showNav={showNav} setShowNav={setShowNav} navRef={navRef} onOpen={onOpen} onDelete={onDelete} />
            <ButtonNav showNav={showNav} setShowNav={setShowNav} />
        </div>
    )
}

export default Navigation
