import React from 'react'

function Download(props) {
    return (
        <div title={props.title} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={props.onClick}>
            <svg className={props.className} width="27" height="35" viewBox="0 0 27 35" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M17.5204 14.5867H23.3469L13.1199 26.2398L2.93364 14.5867H8.76019V0H17.5204V14.5867ZM26.2398 27.7066V35H0V27.7066H26.2398ZM17.5204 30.6403H16.0535V32.1071H17.5204V30.6403ZM20.4133 30.6403H18.9464V32.1071H20.4133V30.6403ZM23.3469 30.6403H21.8801V32.1071H23.3469V30.6403Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Download
