import React from 'react'

function Done(props) {
    return (
        <div title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
            <svg className={props.className} width="45" height="35" viewBox="0 0 45 35" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M37.4138 0L16.5674 21.2853L6.80251 12.069L0 18.8715L16.5674 35L44.2163 6.80251L37.4138 0Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Done
