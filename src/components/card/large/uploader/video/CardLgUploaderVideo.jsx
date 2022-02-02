import React, { useEffect, useRef, useState } from 'react'
import './CardLgUploaderVideo.scss'
import CardLgUploaderSeek from './../seek/CardLgUploaderSeek';
import CardLgUploaderFrame from './../frame/CardLgUploaderFrame';

function CardLgUploaderVideo({ updateSelectRef, mergingRef, vidRef, vidPosRef, progressRef, vidStateRef, lengthRef, startRef, loadStateRef, selectedRef, onFrameSelected, onFrameUnselected, cardFrameStateRef }) {
    const [state, setState] = useState(false)
    const seekStateRef = useRef()
    const valRef = useRef()
    const circleRef = useRef()

    useEffect(() => {
        const val = valRef.current
        const circle = circleRef.current
        if (seekStateRef.current) seekStateRef.current()

        if (vidStateRef) vidStateRef.current = () => {
            setState(!state)
            if (cardFrameStateRef.current) cardFrameStateRef.current()
        }

        if (circle) {
            const circumference = circle.getTotalLength()
            if (progressRef) progressRef.current = (percent) => {
                val.innerHTML = Math.round(percent) + '%'
                circle.style.strokeDashoffset = circumference - (percent / 100) * circumference
            }
        }

        return () => {
            progressRef.current = undefined
            if (vidStateRef) vidStateRef.current = undefined
            if (progressRef) progressRef.current = undefined
        }
    }, [state, progressRef, vidStateRef, cardFrameStateRef])

    const onSeek = (end) => {
        if (cardFrameStateRef.current) cardFrameStateRef.current()
        if (end && updateSelectRef) updateSelectRef.current()
    }

    return (
        <div className={`card-lg-uploader-video card-lg-uploader-video-${vidRef.current.loaded ? 'grid' : 'flex'}`}>
            {vidRef.current.loaded ?
                <>
                    <CardLgUploaderSeek vidRef={vidRef} selectedRef={selectedRef} vidPosRef={vidPosRef} lengthRef={lengthRef} startRef={startRef} seekStateRef={seekStateRef} loadStateRef={loadStateRef} onSeek={onSeek} />
                    <div className='card-lg-uploader-video-container'>
                        <CardLgUploaderFrame cardFrameStateRef={cardFrameStateRef} vidPosRef={vidPosRef} vidRef={vidRef} onSelected={onFrameSelected} onUnselected={onFrameUnselected} />
                    </div>
                </>
                :
                <>
                    <div className='card-lg-uploader-video-progress-container'>
                        <div className='card-lg-uploader-video-progress'>
                            <svg className={vidRef.current.loaded ? 'hide' : ''} width='100' height='100' viewBox='0 0 100 100'>
                                <circle ref={circleRef} className='card-lg-uploader-video-progress-circle-background' cx='50' cy='50' r='30' />
                                <circle ref={circleRef} className='card-lg-uploader-video-progress-circle' cx='50' cy='50' r='30' />
                            </svg>
                        </div>
                        <div ref={valRef} className={`card-lg-uploader-video-progress-value ${vidRef.current.loaded ? 'hide' : ''}`}>0%</div>
                    </div>
                    <div className='card-lg-uploader-video-progress-label'>{mergingRef.current ? 'Merging frames...' : 'Extracting frames...'}</div>
                </>
            }
        </div>
    )
}

export default CardLgUploaderVideo
