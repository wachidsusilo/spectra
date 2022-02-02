import React, { useEffect, useState } from 'react'

function Swap({ className, title, colorClass, onSelected, convRef }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (convRef) convRef.current = setLoading;
        return () => {
            if (convRef) convRef.current = undefined;
        }
    }, [convRef, setLoading]);

    const onClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.accept = '.png, .bmp, .jpg, .jpeg, .tiff, .gif';
        input.onchange = (e) => {
            const imageTypes = ['image/png', 'image/bmp', 'image/jpg', 'image/jpeg', 'image/tiff', 'image/tif', 'image/gif'];
            if (e.target.files && e.target.files.length > 0) {
                if (imageTypes.includes(e.target.files[0].type)) {
                    if (onSelected) onSelected(e.target.files[0]);
                }
            }
            document.body.removeChild(input);
        }
        document.body.appendChild(input);
        input.click();
    }

    return (
        loading ?
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} title='Converting image...'>
                <div style={{
                    width: '18px',
                    height: '18px',
                    marginLeft: '4px',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    border: '3px solid #31577a',
                    borderTop: '3px solid transparent',
                    animation: 'spin 0.5s infinite linear'
                }}></div>
            </div>
            :
            <div title={title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={onClick}>
                <svg className={className} width="47" height="35" viewBox="0 0 47 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className={colorClass} d="M17.5 17.5L8.75 27.064L0 17.5H5.90116C5.90116 7.73256 13.6337 0 23.1977 0C27.8779 0 32.1512 1.8314 35.2035 4.88372L31.3372 9.15698C29.3023 7.12209 26.4535 5.90116 23.4012 5.90116C16.8895 5.90116 11.5988 10.9884 11.5988 17.5H17.5ZM37.8488 7.73256L29.0988 17.5H35C35 23.8081 29.7093 29.0988 23.1977 29.0988C20.1453 29.0988 17.2965 27.8779 15.2616 25.843L11.3953 30.1163C14.4477 33.1686 18.7209 35 23.4012 35C32.9651 35 40.6977 27.064 40.6977 17.5H46.5988L37.8488 7.73256Z" fill="#31577A" />
                </svg>
            </div>
    )
}

export default Swap
