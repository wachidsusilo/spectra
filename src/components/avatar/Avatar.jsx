import React, { useEffect, useRef } from 'react'
import './Avatar.scss'

const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d'
];

function Avatar({ className, username }) {
    const ref = useRef();

    useEffect(() => {
        const element = ref.current;
        if(element) document.documentElement.style.setProperty('--avatar-width', element.clientWidth + 'px');
        const onResize = () => {
            if(element) document.documentElement.style.setProperty('--avatar-width', element.clientWidth + 'px');
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return (
        <div ref={ref} className={`avatar ${className}`} style={{ background: colors[(username.charCodeAt(0) - 65) % 19] }}>
            {username.charAt(0).toUpperCase()}
        </div>
    )
}

export default Avatar
