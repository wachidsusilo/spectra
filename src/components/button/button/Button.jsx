import React from 'react'
import './Button.scss'

function Button({title, onClick}) {
    return (
        <div className='button' onClick={onClick}>
            {title}
        </div>
    )
}

export default Button
