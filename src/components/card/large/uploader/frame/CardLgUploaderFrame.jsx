import React, { useEffect, useState } from 'react'
import './CardLgUploaderFrame.scss'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { getVideoFrames, getVideoSize } from '../../../../../variables/video'
import SelectNone from '../../../../../assets/component/SelectNone'

function CardLgUploaderFrame({ cardFrameStateRef, vidPosRef, vidRef, onSelected, onUnselected }) {
    const [state, setState] = useState(false)
    const videoWidth = getVideoSize()[0]
    const videoHeight = getVideoSize()[1]
    const data = getVideoFrames(vidPosRef.current.startFrame, vidPosRef.current.endFrame)

    let cardWidth, cardHeight, columnCount

    if (videoWidth > videoHeight) {
        cardWidth = 200
        cardHeight = Math.floor((videoHeight / videoWidth) * cardWidth)
    } else {
        cardHeight = 200
        cardWidth = Math.floor((videoWidth / videoHeight) * cardHeight)
    }

    useEffect(() => {
        if (cardFrameStateRef) cardFrameStateRef.current = () => {
            setState(!state)
        }

        return () => {
            if (cardFrameStateRef) cardFrameStateRef.current = undefined
        }
    }, [cardFrameStateRef, state])

    const onImageSelected = (index) => {
        const overlay = document.createElement('div')
        overlay.classList.add('card-lg-uploader-frame-overlay')
        document.body.appendChild(overlay)

        const label = document.createElement('div')
        label.classList.add('card-lg-uploader-frame-label')
        label.innerHTML = '#' + (index + 1)
        document.body.appendChild(label)

        const img = document.createElement('img')
        img.src = data[index]
        img.classList.add('card-lg-uploader-frame-preview')
        img.classList.add('no-select')
        document.body.appendChild(img)

        let height = parseFloat(window.getComputedStyle(img).height)
        const min = height / 2
        const max = height * 3

        img.onwheel = (e) => {
            e.stopPropagation()
            height = height - (e.deltaY / 5)
            if (height < min) height = min
            if (height > max) height = max
            img.style.height = height + 'px'
        }

        const initial = { x: 0, y: 0 }
        const initialPos = { top: 0, left: 0 }
        let isActive = false

        img.onmousedown = (e) => {
            if(!isActive) {
                isActive = true
                initial.x = e.clientX
                initial.y = e.clientY
                initialPos.top = parseFloat(window.getComputedStyle(img).top)
                initialPos.left = parseFloat(window.getComputedStyle(img).left)
                img.style.cursor = 'move'
            }
        }

        const onUp = () => {
            if (isActive) {
                isActive = false
                img.style.cursor = 'default'
            }
        }

        const onMove = (e) => {
            if (isActive) {
                img.style.top = initialPos.top + (e.clientY - initial.y) + 'px'
                img.style.left = initialPos.left + (e.clientX - initial.x) + 'px'
            }
        }

        window.addEventListener('mouseup', onUp)
        window.addEventListener('mousemove', onMove)

        overlay.onclick = () => {
            document.body.removeChild(overlay)
            document.body.removeChild(img)
            document.body.removeChild(label)
            window.removeEventListener('mouseup', onUp)
            window.removeEventListener('mousemove', onMove)
        }
    }

    const cell = ({ columnIndex, rowIndex, style }) => {
        const index = columnIndex + (rowIndex * columnCount)
        if (index >= data.length) {
            return (
                <div style={style}></div>
            )
        }

        return (
            <div style={{ ...style, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', zIndex: 90 }}>
                <div style={{ position: 'relative', width: (cardWidth - 8) + 'px', height: (cardHeight - 16) + 'px', borderRadius: '0 8px 8px 8px', boxSizing: 'border-box' }}>
                    <div className='card-lg-uploader-frame-hash no-select'>
                        {vidPosRef.current.startFrame + index + 1}
                    </div>
                    <div className={`card-lg-uploader-frame-unselect-overlay ${vidRef.current.selected[vidPosRef.current.startFrame + index] ? 'hide' : ''}`} onClick={() => onSelected(vidPosRef.current.startFrame + index)}></div>
                    <SelectNone className='card-lg-uploader-frame-unselect no-select' colorClass='card-lg-uploader-frame-unselect-color' title={'Unselect'} onClick={() => onUnselected(vidPosRef.current.startFrame + index)} />
                    <img className='card-lg-uploader-frame-img' src={data[index]} alt='' onClick={() => onImageSelected(index)} />
                </div>
            </div>
        )
    }

    return (
        <div className='card-lg-uploader-frame'>
            <AutoSizer>
                {({ height, width }) => {
                    columnCount = Math.floor(width / cardWidth)
                    return (
                        <Grid
                            width={width}
                            height={height}
                            columnCount={columnCount}
                            rowCount={Math.ceil(data.length / columnCount)}
                            columnWidth={cardWidth}
                            rowHeight={cardHeight}
                            className='card-lg-uploader-frame-grid'
                        >
                            {cell}
                        </Grid>
                    )
                }}
            </AutoSizer>
        </div>
    )
}

export default CardLgUploaderFrame
