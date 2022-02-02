import React, { useCallback, useEffect, useRef, useState } from 'react'
import './CardLgUploader.scss'
import CardLgUploaderHeader from './../header/CardLgUploaderHeader'
import NoImage from './../../../../../assets/component/NoImage'
import DragAndDrop from './../../../../draganddrop/DragAndDrop'
import Rectangle from './../../../../rectangle/Rectangle'
import { getImageSrc, loadDefaultRect, setDefaultRect, setImageMD5, setImageSrc } from './../../../../../variables/image'
import { getMD5, extractVideoFrame, cancelExtraction, mergeFrame, cancelMerge } from './../../../../../processor/ImageProcessor'
import { convertImage } from '../../../../../api/ConvertImage'
import CardLgUploaderVideo from './../video/CardLgUploaderVideo'
import { getVideoFrames } from '../../../../../variables/video'

function CardLgUploader({ vidPosRef, vidRef, vidAddRef, addRef, editRef, drawRef, analyzingRef, analyzingProgressRef, rotatingRef, rotatingProgressRef, rotateRef, scanRef, onArrowClick, actionRef, saveRef, convRef, convertingRef }) {
    const [editMode, setEditMode] = useState(false)
    const [state, setState] = useState(false)
    const ref = useRef()
    const imgRef = useRef()
    const resetRef = useRef(false)
    const onRotationRef = useRef()
    const progressRef = useRef()
    const vidStateRef = useRef()
    const lengthRef = useRef()
    const startRef = useRef()
    const selectedRef = useRef()
    const loadStateRef = useRef()
    const headerStateRef = useRef()
    const cardFrameStateRef = useRef()
    const updateSelectRef = useRef()
    const mergingRef = useRef(false)

    useEffect(() => {
        if (editRef) editRef.current = () => {
            setState(!state)
        }
        const element = ref.current
        if (element) document.documentElement.style.setProperty('--card-lg-uploader-width', element.clientWidth + 'px')
        const onResize = () => {
            if (element) document.documentElement.style.setProperty('--card-lg-uploader-width', element.clientWidth + 'px')
        }
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [editRef, state])

    const onSetDefault = () => {
        setDefaultRect()
        setState(!state)
    }

    const onLoadDefault = () => {
        loadDefaultRect()
        setState(!state)
    }

    const onImageSelected = (blob) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
            const base64 = reader.result
            resetRef.current = true
            setImageSrc(base64, setEditMode, null, null, true)
        }
        getMD5(blob).then(setImageMD5).catch(console.log)
    }

    const onProgress = (val) => {
        if (progressRef && progressRef.current) progressRef.current(val)
    }

    const onFinish = (frameCount) => {
        vidRef.current.loaded = true
        vidPosRef.current = {
            left: 0,
            right: 0,
            start: 0,
            end: Math.round((frameCount / 30) * 100) / 100,
            total: Math.round((frameCount / 30) * 100) / 100,
            length: Math.round((frameCount / 30) * 100) / 100,
            frame: frameCount,
            frameRate: 30,
            startFrame: 0,
            endFrame: frameCount
        }

        vidRef.current.selected = new Array(frameCount).fill(true)

        const updateView = () => {
            if (loadStateRef.current) loadStateRef.current()
            if (vidStateRef.current) vidStateRef.current()
        }

        if (headerStateRef.current) headerStateRef.current(updateView)
    }

    const onVideoSelected = (blob) => {
        vidRef.current.active = true
        vidRef.current.loaded = false
        setState(!state)
        extractVideoFrame(blob, onProgress, onFinish)
    }

    const onMergingProgress = useCallback((val) => {
        if (progressRef.current) progressRef.current(val)
    }, [])

    const onMergingFinish = useCallback(() => {
        vidRef.current.active = false
        vidRef.current.loaded = false
        mergingRef.current = true
        resetRef.current = true
        setEditMode(true)
        setState(s => !s)
    }, [vidRef])

    const onVideoDone = () => {
        vidRef.current.loaded = false
        mergingRef.current = true
        if (headerStateRef.current) headerStateRef.current()
        if (vidStateRef.current) vidStateRef.current()
        setState(!state)

        const start = vidPosRef.current.startFrame
        const end = vidPosRef.current.endFrame
        const selected = vidRef.current.selected.slice(start, end)
        const frames = getVideoFrames(start, end)
        const data = frames.filter((val, index) => selected[index])
        setTimeout(() => mergeFrame(data, onMergingProgress, onMergingFinish), 100)
    }

    const onVideoSelection = () => {
        vidRef.current.active = true
        vidRef.current.loaded = true
        setState(!state)
    }

    const onVideoCancel = () => {
        vidRef.current.active = false
        vidRef.current.loaded = false
        setState(s => !s)
    }

    const onCancelExtract = () => {
        if (mergingRef.current) {
            cancelMerge()
            mergingRef.current = false
            vidRef.current.loaded = true
            if (headerStateRef.current) headerStateRef.current()
            setState(!state)
        } else {
            cancelExtraction()
            vidRef.current.active = false
            vidRef.current.loaded = false
            setState(!state)
        }
    }

    const onConvert = (blob) => {
        if (convRef) convRef.current(true)
        if (convertingRef) convertingRef.current = true
        if (addRef) addRef.current()
        if (vidAddRef) vidAddRef.current()
        if (headerStateRef) headerStateRef.current()
        convertImage(blob).then((res) => {
            const reader = new FileReader()
            reader.readAsDataURL(res)
            reader.onloadend = () => {
                const base64 = reader.result
                resetRef.current = true
                setImageSrc(base64, setEditMode, null, null, true)
                if (convRef) convRef.current(false)
                if (convertingRef) convertingRef.current = false
                if (addRef) addRef.current()
                if (vidAddRef) vidAddRef.current()
                if (headerStateRef) headerStateRef.current()
            }
            getMD5(res).then(setImageMD5).catch(console.log)
        }).catch(e => {
            console.log(e)
            if (convRef) convRef.current(false)
            if (convertingRef) convertingRef.current = false
            if (addRef) addRef.current()
            if (vidAddRef) vidAddRef.current()
            if (headerStateRef) headerStateRef.current()
        })
    }

    const onFrameUnselected = (index) => {
        if (vidRef.current.selected[index]) {
            vidRef.current.selected[index] = false
            selectedRef.current.innerHTML = parseInt(selectedRef.current.innerHTML) - 1
            if (cardFrameStateRef.current) cardFrameStateRef.current()
            if (updateSelectRef.current) updateSelectRef.current()
        }
    }

    const onFrameSelected = (index) => {
        if (!vidRef.current.selected[index]) {
            vidRef.current.selected[index] = true
            selectedRef.current.innerHTML = parseInt(selectedRef.current.innerHTML) + 1
            if (cardFrameStateRef.current) cardFrameStateRef.current()
            if (updateSelectRef.current) updateSelectRef.current()
        }
    }

    const onSelectNone = () => {
        vidRef.current.selected.fill(false)
        if (selectedRef.current) selectedRef.current.innerHTML = 0
        if (headerStateRef.current) headerStateRef.current()
        if (vidStateRef.current) vidStateRef.current()
    }

    const onSelectAll = () => {
        vidRef.current.selected.fill(true)
        if (selectedRef.current) selectedRef.current.innerHTML = vidRef.current.selected.length
        if (headerStateRef.current) headerStateRef.current()
        if (vidStateRef.current) vidStateRef.current()
    }

    return (
        <div ref={ref} className='card-lg-uploader'>
            <CardLgUploaderHeader
                updateSelectRef={updateSelectRef} vidPosRef={vidPosRef} headerStateRef={headerStateRef}
                selectedRef={selectedRef} lengthRef={lengthRef} startRef={startRef} vidRef={vidRef}
                vidAddRef={vidAddRef} addRef={addRef} convertingRef={convertingRef} convRef={convRef}
                saveRef={saveRef} drawRef={drawRef} actionRef={actionRef} imgRef={imgRef} rotateRef={rotateRef}
                analyzingRef={analyzingRef} analyzingProgressRef={analyzingProgressRef} rotatingRef={rotatingRef}
                onArrowClick={onArrowClick} rotatingProgressRef={rotatingProgressRef} scanRef={scanRef}
                onRotationRef={onRotationRef} editMode={editMode} setEditMode={setEditMode} onImageSelected={onImageSelected}
                onVideoSelected={onVideoSelected} onConvert={onConvert} onVideoDone={onVideoDone} onCancelExtract={onCancelExtract}
                onSelectAll={onSelectAll} onSelectNone={onSelectNone} onVideoSelection={onVideoSelection} onVideoCancel={onVideoCancel}
                onSetDefault={onSetDefault}
                onLoadDefault={onLoadDefault}
            />
            <div className='card-lg-uploader-section'>
                {vidRef && vidRef.current.active ?
                    <CardLgUploaderVideo
                        updateSelectRef={updateSelectRef} cardFrameStateRef={cardFrameStateRef} mergingRef={mergingRef}
                        loadStateRef={loadStateRef} selectedRef={selectedRef} vidRef={vidRef} vidPosRef={vidPosRef}
                        progressRef={progressRef} vidStateRef={vidStateRef} lengthRef={lengthRef} startRef={startRef}
                        onFrameSelected={onFrameSelected} onFrameUnselected={onFrameUnselected}
                    />
                    :
                    getImageSrc() ?
                        <div className='card-lg-uploader-section-container' draggable='false'>
                            <img ref={imgRef} className={`card-lg-uploader-section-image`} src={getImageSrc()} alt='' draggable='false' />
                            <Rectangle state={state} editMode={editMode} resetRef={resetRef} onRotationRef={onRotationRef} />
                        </div>
                        :
                        <div className='card-lg-uploader-section-no-image' draggable='false'>
                            <NoImage className='card-lg-uploader-section-no-image-icon' draggable='false' />
                            <div className='card-lg-uploader-section-no-image-title' draggable='false'>No Image</div>
                        </div>
                }
                <DragAndDrop onDrop={onImageSelected} />
            </div>
        </div>
    )
}

export default CardLgUploader
