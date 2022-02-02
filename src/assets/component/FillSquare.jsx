import React from 'react'

function FillSquare(props) {
    return (
        <div title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
            <svg className={props.className} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M0 10C0 4.47754 4.47754 0 10 0H25C30.5225 0 35 4.47754 35 10V25C35 30.5225 30.5225 35 25 35H10C4.47754 35 0 30.5225 0 25V10H0ZM10 7.5C8.61816 7.5 7.5 8.61816 7.5 10V25C7.5 26.3818 8.61816 27.5 10 27.5H25C26.3818 27.5 27.5 26.3818 27.5 25V10C27.5 8.61816 26.3818 7.5 25 7.5H10V7.5Z" fill="#31577A" />
                {props.fill && <path className={props.colorClass} d="M22.5 12.5H12.5V22.5H22.5V12.5Z" fill="#31577A" />}
            </svg>
        </div>
    )
}

export default FillSquare
