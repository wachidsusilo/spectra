import React from 'react'

function Stop(props) {
    return (
        <div title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
            <svg className={props.className} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M0 0H35V35H0V0Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Stop
