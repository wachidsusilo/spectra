import React, { useEffect, useState } from 'react'

function AddImage({className, title, colorClass, onSelected, convertingRef, addRef}) {
    const [state, setState] = useState();

    useEffect(() => {
        if(addRef) addRef.current = () => {
            setState(!state);
        }

        return () => {
            if(addRef) addRef.current = undefined;
        }
    }, [addRef, state])

    const onClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.accept = '.png, .bmp, .jpg, .jpeg, .tiff, .gif, .dng, .raw';
        input.onchange = (e) => {
            const imageTypes = ['image/png', 'image/bmp', 'image/jpg', 'image/jpeg', 'image/dng', 'image/raw'];
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
        <div title={title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={convertingRef && convertingRef.current ? undefined : onClick}>
            <svg className={`${className} ${convertingRef && convertingRef.current ? 'disabled' : ''}`} width="47" height="35" viewBox="0 0 47 35" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path className={`${colorClass} ${convertingRef && convertingRef.current ? 'disabled-color' : ''}`} d="M37.8283 17.5C33.0556 17.5 29.1667 21.3889 29.1667 26.1616C29.1667 31.1111 33.0556 35 37.8283 35C42.7778 35 46.6667 31.1111 46.6667 26.1616C46.6667 21.3889 42.7778 17.5 37.8283 17.5ZM42.7778 27.2222H38.8889V31.1111H36.9444V27.2222H33.0556V25.2778H36.9444V21.3889H38.8889V25.2778H42.7778V27.2222ZM7.77778 27.2222L15.5556 15.5556L20.3283 19.4444L25.2778 11.6667L28.8131 17.5C26.3384 19.9747 24.9242 23.3333 25.2778 27.2222H7.77778ZM28.8131 35H0V0H42.7778V14.4949C41.5404 14.1414 40.303 13.7879 38.8889 13.6111V3.88889H3.88889V31.1111H26.1616C26.8687 32.5253 27.7525 33.7626 28.8131 35ZM10.6061 13.6111C9.01515 13.6111 7.77778 12.3737 7.77778 10.6061C7.77778 9.01515 9.01515 7.77778 10.6061 7.77778C12.3737 7.77778 13.6111 9.01515 13.6111 10.6061C13.6111 12.3737 12.3737 13.6111 10.6061 13.6111Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default AddImage

