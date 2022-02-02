import React from 'react'

function Open(props) {
    return (
        <div title={props.title} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={props.onClick}>
            <svg className={props.className} width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M5.99943 15.0014C8.2715 5.11936 17.0032 3.33621 17.0032 3.33621V0L24.0035 6.63791L17.0032 13.3333V10.0029C17.0032 10.0029 10.8312 9.83031 5.99943 15.0014V15.0014ZM17.9983 15.1452V18.004H2.00173V5.99942H8.59937C9.3644 5.21139 10.1582 4.5499 10.9405 4.00345H0V20H20V13.2298L17.9983 15.1452V15.1452Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Open
