import React, { useEffect, useState } from 'react'

function Play(props) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(props.runRef) {
            props.runRef.current = setLoading;
        }
        return () => {
            if(props.runRef) props.runRef.current = undefined;
        }
    }, [props.runRef, setLoading])

    return (
        loading ?
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} title='Collecting data...'>
                <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    border: '3px solid #31577a',
                    borderTop: '3px solid transparent',
                    animation: 'spin 0.5s infinite linear'
                }}></div>
            </div>
            :
            <div title={props.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={props.onClick}>
                <svg className={props.className} width="32" height="35" viewBox="0 0 32 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className={props.colorClass} d="M0 35V0L31.5021 17.4893L0 35Z" fill="#31577A" />
                </svg>
            </div>
    )
}

export default Play
