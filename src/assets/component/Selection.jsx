import React from 'react'

function Selection(props) {
    return (
        <div title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
            <svg className={props.className} width="33" height="35" viewBox="0 0 33 35" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M25.9097 25.375L29.7986 33.25L26.25 35L22.3125 27.0278L17.5 31.2083V13.125L32.0833 24.3056L25.9097 25.375ZM29.1667 14.5833H32.0833V8.75H29.1667V14.5833ZM29.1667 18.4236L32.0833 20.6597V17.5H29.1667V18.4236ZM14.5833 31.2083V29.1667H8.75V32.0833H14.5833V31.2083ZM2.91667 26.25H0V32.0833H5.83333V29.1667H2.91667V26.25ZM0 5.83333H2.91667V2.91667H5.83333V0H0V5.83333H0ZM2.91667 17.5H0V23.3333H2.91667V17.5ZM14.5833 0H8.75V2.91667H14.5833V0ZM23.3333 0H17.5V2.91667H23.3333V0ZM29.1667 5.83333H32.0833V0H26.25V2.91667H29.1667V5.83333ZM2.91667 8.75H0V14.5833H2.91667V8.75Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Selection
