import React, { useEffect, useState } from 'react'

function Video({ className, title, colorClass, onSelected, convertingRef, addRef }) {
    const [state, setState] = useState();

    useEffect(() => {
        if (addRef) addRef.current = () => {
            setState(!state);
        }

        return () => {
            if (addRef) addRef.current = undefined;
        }
    }, [addRef, state])

    const onClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.accept = '.mp4, .ogg, .webm';
        input.onchange = (e) => {
            const imageTypes = ['video/mp4', 'video/ogg', 'video/webm'];
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
        <div className={className} title={title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={convertingRef && convertingRef.current ? undefined : onClick}>
            <svg className={convertingRef && convertingRef.current ? 'disabled' : ''} style={{ width: '100%', height: '100%' }} viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={`${colorClass} ${convertingRef && convertingRef.current ? 'disabled-color' : ''}`} d="M0 0V32.1531H35V0H0ZM5.86124 29.3062H2.84689V26.2919H5.86124V29.3062ZM5.86124 23.445H2.84689V20.4306H5.86124V23.445ZM5.86124 17.5837H2.84689V14.5694H5.86124V17.5837ZM5.86124 11.7225H2.84689V8.70813H5.86124V11.7225V11.7225ZM5.86124 5.86124H2.84689V2.84689H5.86124V5.86124ZM26.2919 23.445H8.70813V8.70813H26.2919V23.445ZM32.1531 29.3062H29.3062V26.2919H32.1531V29.3062ZM32.1531 23.445H29.3062V20.4306H32.1531V23.445ZM32.1531 17.5837H29.3062V14.5694H32.1531V17.5837ZM32.1531 11.7225H29.3062V8.70813H32.1531V11.7225V11.7225ZM32.1531 5.86124H29.3062V2.84689H32.1531V5.86124ZM14.5694 20.4306V11.7225L21.9378 16.0766L14.5694 20.4306Z" fill="#31577A" />
            </svg>
        </div>
    )
}

export default Video
