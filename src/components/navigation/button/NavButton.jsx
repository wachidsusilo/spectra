import React from 'react'
import './NavButton.scss'
import Menu from '../../../assets/component/Menu';

function NavButton({ showNav, setShowNav }) {

    const onClickNavMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowNav(!showNav);
    }

    return (
        <div className={`button-nav-rect ${showNav ? 'button-nav-rect-hide' : 'button-nav-rect-show'}`} onClick={onClickNavMenu}>
            <Menu className='button-nav-menu' colorClass='button-nav-menu-color' />
        </div>
    )
}

export default NavButton
