import React from 'react'

function MenuDot(props) {
    return (
        <div className={props.className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={props.title} onClick={props.onClick}>
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 9 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M4.2 25.9C7 25.9 8.4 28 8.4 30.1C8.4 32.9 7 35 4.2 35C2.1 35 0 32.9 0 30.1C0 28 2.1 25.9 4.2 25.9ZM4.2 13.3C7 13.3 8.4 14.7 8.4 17.5C8.4 19.6 7 21.7 4.2 21.7C2.1 21.7 0 19.6 0 17.5C0 14.7 2.1 13.3 4.2 13.3ZM4.2 0C7 0 8.4 2.1 8.4 4.2C8.4 7 7 8.4 4.2 8.4C2.1 8.4 0 7 0 4.2C0 2.1 2.1 0 4.2 0Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default MenuDot
