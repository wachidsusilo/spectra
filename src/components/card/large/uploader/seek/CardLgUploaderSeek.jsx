import React, { useEffect, useRef, useState } from 'react'
import './CardLgUploaderSeek.scss'

function CardLgUploaderSeek({ vidPosRef, lengthRef, startRef, seekStateRef, loadStateRef, onSeek, selectedRef, vidRef }) {
    const [state, setState] = useState()
    const [active, setActive] = useState({
        left: false,
        right: false
    })
    const leftRef = useRef()
    const rightRef = useRef()
    const leftTooltipRef = useRef()
    const rightTooltipRef = useRef()
    const rightLabelRef = useRef()
    const seekRef = useRef()
    const containerRef = useRef()
    const bodyRef = useRef()
    const firstRef = useRef(true)

    useEffect(() => {
        const act = active
        const left = leftRef.current
        const right = rightRef.current
        const leftTooltip = leftTooltipRef.current
        const rightTooltip = rightTooltipRef.current
        const rightLabel = rightLabelRef.current
        const seek = seekRef.current
        const container = containerRef.current
        const body = bodyRef.current
        const length = lengthRef.current
        const start = startRef.current
        const selected = selectedRef.current
        const c = container.getBoundingClientRect();
        const b = body.getBoundingClientRect();

        if (seekStateRef) seekStateRef.current = () => {
            setState(!state)
        }

        const initialize = () => {
            const r = right.getBoundingClientRect()
            const t = rightTooltip.getBoundingClientRect();
            let offset = Math.round(b.right - r.right - 10)
            if (offset > t.width / 2) offset = t.width / 2
            rightTooltip.style.right = 'calc(50% - ' + offset + 'px)'

            leftTooltip.innerHTML = vidPosRef.current.start.toFixed(2) + ' s'
            rightTooltip.innerHTML = vidPosRef.current.end.toFixed(2) + ' s'

            seek.style.left = vidPosRef.current.left + '%'
            seek.style.right = vidPosRef.current.right + '%'

            let selectCount = 0
            for (let i = vidPosRef.current.startFrame; i < vidPosRef.current.endFrame; i++) {
                if (vidRef.current.selected[i]) selectCount++
            }

            rightLabel.innerHTML = vidPosRef.current.total.toFixed(2) + ' s'
            if (length) length.value = vidPosRef.current.length.toFixed(2)
            if (start) start.value = vidPosRef.current.start.toFixed(2)
            if (selected) selected.innerHTML = selectCount
        }

        if (loadStateRef) loadStateRef.current = () => {
            initialize()
        }

        if (firstRef.current) {
            firstRef.current = false
            initialize()
        }

        const normalizeValue = (percent) => {
            const timestamp = percent * vidPosRef.current.total / 100
            const frame = Math.round(timestamp * vidPosRef.current.frameRate)
            return (frame / (vidPosRef.current.total * vidPosRef.current.frameRate)) * 100
        }

        const onStartDown = (e) => {
            if (e.key === 'Enter') {
                if (start.value === '') start.value = vidPosRef.current.start
                let val = parseFloat(start.value)
                if (val < 0) val = 0
                if (val > vidPosRef.current.end) val = vidPosRef.current.end
                const l = left.getBoundingClientRect()
                const t = rightTooltip.getBoundingClientRect();

                const leftPercent = normalizeValue((val / vidPosRef.current.total) * 100)
                vidPosRef.current.left = leftPercent
                vidPosRef.current.start = leftPercent * vidPosRef.current.total / 100
                vidPosRef.current.length = vidPosRef.current.end - vidPosRef.current.start;
                vidPosRef.current.frame = Math.round(vidPosRef.current.length * vidPosRef.current.frameRate);
                vidPosRef.current.startFrame = Math.round(vidPosRef.current.start * vidPosRef.current.frameRate)
                vidPosRef.current.endFrame = vidPosRef.current.startFrame + vidPosRef.current.frame

                let leftStr = leftPercent + '%'
                if (leftPercent >= 100 - vidPosRef.current.right - (20 / c.width) * 100) leftStr = 'calc(' + (100 - vidPosRef.current.right) + '% - 20px)'
                seek.style.left = leftStr

                leftTooltip.innerHTML = vidPosRef.current.start.toFixed(2) + ' s'
                let offset = Math.floor(l.left - b.left - 10)
                if (offset > t.width / 2) offset = t.width / 2
                leftTooltip.style.left = 'calc(50% - ' + offset + 'px)'

                let selectCount = 0
                for (let i = vidPosRef.current.startFrame; i < vidPosRef.current.endFrame; i++) {
                    if (vidRef.current.selected[i]) selectCount++
                }

                length.value = (Math.floor(vidPosRef.current.length * 100) / 100).toFixed(2)
                start.value = vidPosRef.current.start.toFixed(2)
                selected.innerHTML = selectCount

                if (onSeek) onSeek()
                start.blur()
            }
        }

        const onLengthDown = (e) => {
            if (e.key === 'Enter') {
                if (length.value === '') length.value = vidPosRef.current.length.toFixed(2)
                let val = parseFloat(length.value)
                if (val < 0) val = 0
                if (val > vidPosRef.current.total - vidPosRef.current.start) val = vidPosRef.current.total - vidPosRef.current.start

                const r = right.getBoundingClientRect()
                const t = rightTooltip.getBoundingClientRect();
                
                const rightPercent = 100 - normalizeValue(((vidPosRef.current.start + val) / vidPosRef.current.total) * 100)
                vidPosRef.current.right = rightPercent
                vidPosRef.current.end = (100 - rightPercent) * vidPosRef.current.total / 100
                vidPosRef.current.length = vidPosRef.current.end - vidPosRef.current.start;
                vidPosRef.current.frame = Math.round(vidPosRef.current.length * vidPosRef.current.frameRate);
                vidPosRef.current.startFrame = Math.round(vidPosRef.current.start * vidPosRef.current.frameRate)
                vidPosRef.current.endFrame = vidPosRef.current.startFrame + vidPosRef.current.frame

                let rightStr = rightPercent + '%'
                if (rightPercent >= 100 - vidPosRef.current.left - (20 / c.width) * 100) rightStr = 'calc(' + (100 - vidPosRef.current.left) + '% - 20px)'
                seek.style.right = rightStr

                rightTooltip.innerHTML = vidPosRef.current.end.toFixed(2) + ' s'
                let offset = Math.round(b.right - r.right - 10)
                if (offset > t.width / 2) offset = t.width / 2
                rightTooltip.style.right = 'calc(50% - ' + offset + 'px)'

                let selectCount = 0
                for (let i = vidPosRef.current.startFrame; i < vidPosRef.current.endFrame; i++) {
                    if (vidRef.current.selected[i]) selectCount++
                }

                length.value = vidPosRef.current.length.toFixed(2)
                start.value = vidPosRef.current.start.toFixed(2)
                selected.innerHTML = selectCount

                if (onSeek) onSeek()
                length.blur()
            }
        }

        const onInputLength = (e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '')
        }

        const onInputFrame = (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '')
        }

        const setStyle = (bgColor) => {
            left.style.backgroundColor = bgColor
            right.style.backgroundColor = bgColor
            seek.style.backgroundColor = bgColor
        }

        const onLeftDown = () => {
            setActive({ left: true, right: false })
            document.body.style.cursor = 'w-resize'
            setStyle('#076dcc')
            left.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.3)'
            leftTooltip.innerHTML = vidPosRef.current.start.toFixed(2) + ' s'
            leftTooltip.style.display = 'flex'
        }

        const onRightDown = () => {
            setActive({ left: false, right: true })
            document.body.style.cursor = 'e-resize'
            setStyle('#076dcc')
            right.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.3)'
            rightTooltip.innerHTML = vidPosRef.current.end.toFixed(2) + ' s'
            rightTooltip.style.display = 'flex'
        }

        const onUp = () => {
            setActive({ left: false, right: false })
            document.body.style.cursor = 'default'
            setStyle('#31577a')
            left.style.boxShadow = 'none'
            right.style.boxShadow = 'none'
            leftTooltip.style.display = 'none'
            rightTooltip.style.display = 'none'
            if(onSeek) onSeek(true)
        }

        const onMove = (e) => {
            if (vidPosRef && (act.left || act.right)) {
                e.preventDefault();
                e.stopPropagation();
                let x = e.clientX - c.left;
                if (isNaN(x)) x = e.touches[0].clientX - c.left;
                const l = left.getBoundingClientRect()
                const r = right.getBoundingClientRect()

                if (act.left) {
                    const t = leftTooltip.getBoundingClientRect();
                    let leftPercent = normalizeValue((x / c.width) * 100)
                    if (leftPercent >= 100 - vidPosRef.current.right) leftPercent = 100 - vidPosRef.current.right
                    if (leftPercent < 0) leftPercent = 0
                    vidPosRef.current.left = leftPercent
                    vidPosRef.current.start = leftPercent * vidPosRef.current.total / 100
                    vidPosRef.current.length = vidPosRef.current.end - vidPosRef.current.start;
                    vidPosRef.current.frame = Math.round(vidPosRef.current.length * vidPosRef.current.frameRate);
                    vidPosRef.current.startFrame = Math.round(vidPosRef.current.start * vidPosRef.current.frameRate)
                    vidPosRef.current.endFrame = vidPosRef.current.startFrame + vidPosRef.current.frame

                    let leftStr = leftPercent + '%'
                    if (leftPercent >= 100 - vidPosRef.current.right - (20 / c.width) * 100) leftStr = 'calc(' + (100 - vidPosRef.current.right) + '% - 20px)'
                    seek.style.left = leftStr

                    leftTooltip.innerHTML = vidPosRef.current.start.toFixed(2) + ' s'
                    let offset = Math.floor(l.left - b.left - 10)
                    if (offset > t.width / 2) offset = t.width / 2
                    leftTooltip.style.left = 'calc(50% - ' + offset + 'px)'

                    let selectCount = 0
                    for (let i = vidPosRef.current.startFrame; i < vidPosRef.current.endFrame; i++) {
                        if (vidRef.current.selected[i]) selectCount++
                    }

                    length.value = (Math.floor(vidPosRef.current.length * 100) / 100).toFixed(2)
                    start.value = vidPosRef.current.start.toFixed(2)
                    selected.innerHTML = selectCount
                    if (onSeek) onSeek()
                }

                if (act.right) {
                    const t = rightTooltip.getBoundingClientRect();
                    let rightPercent = 100 - normalizeValue((x / c.width) * 100)
                    if (rightPercent >= 100 - vidPosRef.current.left) rightPercent = 100 - vidPosRef.current.left
                    if (rightPercent < 0) rightPercent = 0
                    vidPosRef.current.right = rightPercent
                    vidPosRef.current.end = (100 - rightPercent) * vidPosRef.current.total / 100
                    vidPosRef.current.length = vidPosRef.current.end - vidPosRef.current.start;
                    vidPosRef.current.frame = Math.round(vidPosRef.current.length * vidPosRef.current.frameRate);
                    vidPosRef.current.startFrame = Math.round(vidPosRef.current.start * vidPosRef.current.frameRate)
                    vidPosRef.current.endFrame = vidPosRef.current.startFrame + vidPosRef.current.frame

                    let rightStr = rightPercent + '%'
                    if (rightPercent >= 100 - vidPosRef.current.left - (20 / c.width) * 100) rightStr = 'calc(' + (100 - vidPosRef.current.left) + '% - 20px)'
                    seek.style.right = rightStr

                    rightTooltip.innerHTML = vidPosRef.current.end.toFixed(2) + ' s'
                    let offset = Math.round(b.right - r.right - 10)
                    if (offset > t.width / 2) offset = t.width / 2
                    rightTooltip.style.right = 'calc(50% - ' + offset + 'px)'

                    let selectCount = 0
                    for (let i = vidPosRef.current.startFrame; i < vidPosRef.current.endFrame; i++) {
                        if (vidRef.current.selected[i]) selectCount++
                    }

                    length.value = (Math.floor(vidPosRef.current.length * 100) / 100).toFixed(2)
                    start.value = vidPosRef.current.start.toFixed(2)
                    selected.innerHTML = selectCount
                    if (onSeek) onSeek()
                }
            }
        }

        left.addEventListener('mousedown', onLeftDown)
        left.addEventListener('touchstart', onLeftDown)
        right.addEventListener('mousedown', onRightDown)
        right.addEventListener('touchstart', onRightDown)
        window.addEventListener('mouseup', onUp)
        window.addEventListener('touchend', onUp)
        window.addEventListener('mousemove', onMove)
        window.addEventListener('touchmove', onMove)

        if (length) length.addEventListener('keydown', onLengthDown)
        if (length) length.addEventListener('input', onInputLength)
        if (start) start.addEventListener('keydown', onStartDown)
        if (start) start.addEventListener('input', onInputFrame)

        return () => {
            left.removeEventListener('mousedown', onLeftDown)
            left.removeEventListener('touchstart', onLeftDown)
            right.removeEventListener('mousedown', onRightDown)
            right.removeEventListener('touchstart', onRightDown)
            window.removeEventListener('mouseup', onUp)
            window.removeEventListener('touchend', onUp)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('touchmove', onMove)

            if (length) length.removeEventListener('keydown', onLengthDown)
            if (length) length.removeEventListener('input', onInputLength)
            if (start) start.removeEventListener('keydown', onStartDown)
            if (start) start.removeEventListener('input', onInputFrame)
            if (loadStateRef) loadStateRef.current = undefined
        }
    }, [vidPosRef, active, lengthRef, startRef, seekStateRef, state, onSeek, loadStateRef, selectedRef, vidRef])

    return (
        <div ref={bodyRef} className='card-lg-uploader-seek'>
            <div ref={containerRef} className='card-lg-uploader-seek-container'>
                <div ref={seekRef} className='card-lg-uploader-seek-container-foreground' style={{ right: vidPosRef ? vidPosRef.current.right + '%' : '100%', left: vidPosRef ? vidPosRef.current.left + '%' : 0 }}>
                    <div ref={leftRef} className='card-lg-uploader-seek-container-foreground-circle-left card-lg-uploader-seek-container-foreground-circle-left-hover'>
                        <div ref={leftTooltipRef} className='card-lg-uploader-seek-container-foreground-circle-tooltip card-lg-uploader-seek-left-tooltip'>0 s</div>
                    </div>
                    <div ref={rightRef} className='card-lg-uploader-seek-container-foreground-circle-right card-lg-uploader-seek-container-foreground-circle-right-hover'>
                        <div ref={rightTooltipRef} className='card-lg-uploader-seek-container-foreground-circle-tooltip card-lg-uploader-seek-right-tooltip'>0 s</div>
                    </div>
                </div>
                <div className='card-lg-uploader-seek-container-label-left'>0 s</div>
                <div ref={rightLabelRef} className='card-lg-uploader-seek-container-label-right'>- s</div>
            </div>
        </div>
    )
}

export default CardLgUploaderSeek
