import React from 'react'

function Save(props) {
    return (
        <div title={props.title} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={props.onClick}>
            <svg className={props.className} width="35" height="35" viewBox="0 0 35 35" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M21.8869 4.38009H26.2534V11.6621H21.8869V4.38009ZM35 5.83107V35H0V0H29.1689L35 5.83107ZM7.29562 13.1267H27.7179V2.91554H7.29562V13.1267ZM30.6335 18.9578H4.38009V32.0845H30.6335V18.9578Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Save
