import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import './Progress.scss'

const Progress = forwardRef(({ className, onClick, title }, ref) => {
    const titleRef = useRef();
    const lineRef = useRef();
    const parentRef = useRef();

    useImperativeHandle(ref, () => ({
        get title() {
            return titleRef.current;
        },
        get line() {
            return lineRef.current;
        },
        get parent() {
            return parentRef.current;
        }
    }))

    return (
        <div ref={parentRef} className={`progress ${className}`} onClick={onClick} title={title}>
            <div ref={titleRef} className='progress-title'></div>
            <div className='progress-line'>
                <div ref={lineRef} className='progress-line-inner'></div>
            </div>
        </div>
    )
})

export default Progress
