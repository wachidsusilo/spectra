import React from 'react'

function Menu(props) {
    return (
        <svg className={props.className} onClick={props.onClick} width="49" height="40" viewBox="0 0 49 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className={props.colorClass} d="M48.0899 7.94007H0V0H48.0899V7.94007ZM48.0899 16.03H0V23.97H48.0899V16.03ZM48.0899 32.0599H0V40H48.0899V32.0599V32.0599Z" fill="#31577A" />
        </svg>
    )
}

export default Menu
