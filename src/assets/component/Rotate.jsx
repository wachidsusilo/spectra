import React, { forwardRef } from 'react'

const Rotate = forwardRef((props, ref) => {
    return (
        <div ref={ref} title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
            <svg className={props.className} width="31" height="35" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M0 0H4.66667V5.83333C7.29167 3.79167 10.7917 2.625 14.875 2.625C23.625 2.625 30.9167 9.91667 30.9167 18.6667C30.9167 27.7083 23.625 35 14.875 35C9.625 35 5.25 32.9583 2.33333 29.1667L6.125 26.5417C8.16667 28.875 11.375 30.3333 14.875 30.3333C21.2917 30.3333 26.25 25.375 26.25 18.6667C26.25 12.25 21.2917 7 14.875 7C12.25 7 9.91667 7.875 7.875 9.33333H14V14H0V0V0Z" fill="#31577A" />
            </svg>
        </div>
    )
})

export default Rotate
