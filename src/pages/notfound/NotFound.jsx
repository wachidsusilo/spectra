import React from 'react'
import './NotFound.scss'

function NotFound() {
    return (
        <div className='not-found'>
            <div className='not-found-rect'>
                <h1 className='not-found-title'>404</h1>
                <p className='not-found-description'>The page you are looking for cannot be found</p>
            </div>
        </div>
    )
}

export default NotFound
