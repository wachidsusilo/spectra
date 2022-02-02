import React from 'react'

function Delete(props) {
    return (
        <div title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
            <svg className={props.className} width="100" height="100" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={props.colorClass} d="M20 16.8627L13.0882 10L19.902 3.08824L16.8627 0L10 6.96078L3.03922 0.0980392L0 3.13725L6.96078 10.049L0.0980392 16.9608L3.13725 20L10.049 13.0882L16.9118 19.902L20 16.8627Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Delete

