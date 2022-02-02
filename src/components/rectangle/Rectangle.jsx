import React, { useEffect, useRef, useState } from 'react'
import './Rectangle.scss'
import { getDefaultRect, getImageSize, getNaturalRect, loadDefaultRect, setNaturalRect, setRect } from '../../variables/image';

function Rectangle({ className, editMode, resetRef, onRotationRef, state }) {
    const [hide, setHide] = useState(true);
    const contRef = useRef();
    const rectRef = useRef();
    const dotRef1 = useRef();
    const dotRef2 = useRef();
    const dotRef3 = useRef();
    const dotRef4 = useRef();
    const dotRef5 = useRef();
    const dotRef6 = useRef();
    const dotRef7 = useRef();
    const dotRef8 = useRef();
    const dotRef9 = useRef();
    const legendX = useRef();
    const legendY = useRef();
    const legendW = useRef();
    const legendH = useRef();
    const sizeW = useRef();
    const sizeH = useRef();

    useEffect(() => {
        const container = contRef.current;
        const rect = rectRef.current;
        const dot = [
            dotRef1.current,
            dotRef2.current,
            dotRef3.current,
            dotRef4.current,
            dotRef5.current,
            dotRef6.current,
            dotRef7.current,
            dotRef8.current,
            dotRef9.current
        ];
        const legend = [
            legendX.current,
            legendY.current,
            legendW.current,
            legendH.current
        ]
        const size = [
            sizeW.current,
            sizeH.current
        ]

        let dotFlag = [false, false, false, false, false, false, false, false, false];
        let cursor = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize', 'move'];

        if (resetRef && resetRef.current) loadDefaultRect()

        if (onRotationRef) {
            onRotationRef.current = () => {
                let containerWidth = parseFloat(container.clientWidth);
                let containerHeight = parseFloat(container.clientHeight);

                const imageRatio = getImageSize()[0] / getImageSize()[1];
                const containerRatio = containerWidth / containerHeight;

                let imageWidth;
                let imageHeight;
                let scaleRatio;

                if (imageRatio > containerRatio) {
                    imageWidth = containerWidth;
                    imageHeight = Math.round(imageWidth / imageRatio);
                    scaleRatio = getImageSize()[0] / imageWidth;
                } else {
                    imageHeight = containerHeight;
                    imageWidth = Math.round(imageRatio * imageHeight);
                    scaleRatio = getImageSize()[1] / imageHeight;
                }

                let imageLeft = Math.floor((containerWidth - imageWidth) / 2);
                let imageTop = Math.floor((containerHeight - imageHeight) / 2);

                let top = ((getImageSize()[1] - getNaturalRect().width - getNaturalRect().left) / scaleRatio) + imageTop;
                let left = (getNaturalRect().top / scaleRatio) + imageLeft;
                let width = (getNaturalRect().height / scaleRatio);
                let height = (getNaturalRect().width / scaleRatio);

                rect.style.top = top + 'px';
                rect.style.left = left + 'px';
                rect.style.width = width + 'px';
                rect.style.height = height + 'px';

                let trueLeft = Math.round((left - imageLeft) * scaleRatio);
                let trueTop = Math.round((top - imageTop) * scaleRatio);
                let trueWidth = Math.round(width * scaleRatio);
                let trueHeight = Math.round(height * scaleRatio);

                legend[0].value = trueLeft
                legend[1].value = trueTop
                legend[2].value = trueWidth
                legend[3].value = trueHeight
                size[0].innerHTML = trueWidth
                size[1].innerHTML = trueHeight

                setRect({ width: width, height: height, top: (top - imageTop), left: (left - imageLeft) }, scaleRatio);
            }
        }

        const initializeRect = () => {
            if (getImageSize()) {
                let containerWidth = parseFloat(container.clientWidth);
                let containerHeight = parseFloat(container.clientHeight);

                const imageRatio = getImageSize()[0] / getImageSize()[1];
                const containerRatio = containerWidth / containerHeight;

                let imageWidth;
                let imageHeight;
                let scaleRatio;

                if (imageRatio > containerRatio) {
                    imageWidth = containerWidth;
                    imageHeight = Math.round(imageWidth / imageRatio);
                    scaleRatio = getImageSize()[0] / imageWidth;
                } else {
                    imageHeight = containerHeight;
                    imageWidth = Math.round(imageRatio * imageHeight);
                    scaleRatio = getImageSize()[1] / imageHeight;
                }

                let imageLeft = Math.floor((containerWidth - imageWidth) / 2);
                let imageRight = imageLeft + imageWidth;
                let imageTop = Math.floor((containerHeight - imageHeight) / 2);
                let imageBottom = imageTop + imageHeight;

                let top = resetRef && resetRef.current && !getDefaultRect() ? imageTop : getNaturalRect() ? (getNaturalRect().top / scaleRatio) + imageTop : parseFloat(rect.style.top);
                let left = resetRef && resetRef.current && !getDefaultRect() ? imageLeft : getNaturalRect() ? (getNaturalRect().left / scaleRatio) + imageLeft : parseFloat(rect.style.left);
                let width = resetRef && resetRef.current && !getDefaultRect() ? imageWidth : getNaturalRect() ? (getNaturalRect().width / scaleRatio) : parseFloat(rect.style.width);
                let height = resetRef && resetRef.current && !getDefaultRect() ? imageHeight : getNaturalRect() ? (getNaturalRect().height / scaleRatio) : parseFloat(rect.style.height);

                if (top < imageTop || top > imageBottom || isNaN(top)) top = imageTop;
                if (left < imageLeft || left > imageRight || isNaN(left)) left = imageLeft;
                if (left + width > imageRight || isNaN(width)) width = imageWidth - (left - imageLeft);
                if (top + height > imageBottom || isNaN(height)) height = imageHeight - (top - imageTop);

                rect.style.top = top + 'px';
                rect.style.left = left + 'px';
                rect.style.width = width + 'px';
                rect.style.height = height + 'px';

                let trueLeft = Math.round((left - imageLeft) * scaleRatio);
                let trueTop = Math.round((top - imageTop) * scaleRatio);
                let trueWidth = Math.round(width * scaleRatio);
                let trueHeight = Math.round(height * scaleRatio);

                legend[0].value = trueLeft
                legend[1].value = trueTop
                legend[2].value = trueWidth
                legend[3].value = trueHeight
                size[0].innerHTML = trueWidth
                size[1].innerHTML = trueHeight

                if (resetRef && resetRef.current) resetRef.current = false;
                setRect({ width: width, height: height, top: (top - imageTop), left: (left - imageLeft) }, scaleRatio);
                setHide(false);
            }
        }

        const onLegendInput = (e) => {
            const str = e.target.value.replace(/[^0-9]/, '')
            e.target.value = str
            switch (e.target.id) {
                case 'legend-x':
                    setNaturalRect('x', parseInt(str))
                    break
                case 'legend-y':
                    setNaturalRect('y', parseInt(str))
                    break
                case 'legend-w':
                    setNaturalRect('w', parseInt(str))
                    break
                default:
                    setNaturalRect('h', parseInt(str))
                    break
            }
            initializeRect()
        }

        if (getImageSize()) {
            let containerWidth = parseFloat(container.clientWidth);
            let containerHeight = parseFloat(container.clientHeight);

            const imageRatio = getImageSize()[0] / getImageSize()[1];
            const containerRatio = containerWidth / containerHeight;

            let imageWidth;
            let imageHeight;
            let scaleRatio;

            if (imageRatio > containerRatio) {
                imageWidth = containerWidth;
                imageHeight = Math.round(imageWidth / imageRatio);
                scaleRatio = getImageSize()[0] / imageWidth;
            } else {
                imageHeight = containerHeight;
                imageWidth = Math.round(imageRatio * imageHeight);
                scaleRatio = getImageSize()[1] / imageHeight;
            }

            let imageLeft = Math.floor((containerWidth - imageWidth) / 2);
            let imageRight = imageLeft + imageWidth;
            let imageTop = Math.floor((containerHeight - imageHeight) / 2);
            let imageBottom = imageTop + imageHeight;

            initializeRect();

            const isActive = () => {
                for (let i = 0; i < dotFlag.length; i++) {
                    if (dotFlag[i]) return true;
                }
                return false;
            }

            const onMouseMove = (e) => {
                if (isActive()) {
                    if (!editMode) return true;
                    e.preventDefault();
                    e.stopPropagation();
                    const r = container.getBoundingClientRect();
                    let x = e.clientX - r.left;
                    let y = e.clientY - Math.round(r.top);
                    if (isNaN(x)) x = e.touches[0].clientX - r.left;
                    if (isNaN(y)) y = e.touches[0].clientY - Math.round(r.top);

                    if (y < imageTop) y = imageTop;
                    if (y > imageBottom) y = imageBottom;
                    if (x < imageLeft) x = imageLeft;
                    if (x > imageRight) x = imageRight;

                    let top = parseFloat(rect.style.top);
                    let left = parseFloat(rect.style.left);
                    let width = parseFloat(rect.style.width);
                    let height = parseFloat(rect.style.height);

                    let topBound = top + height - (1 / scaleRatio);
                    let leftBound = left + width - (1 / scaleRatio);

                    if (dotFlag[0]) {
                        height = height + (top - y);
                        top = y;
                    } else if (dotFlag[1]) {
                        width = x - left;
                        height = height + (top - y);
                        top = y;
                    } else if (dotFlag[2]) {
                        width = x - left;
                    } else if (dotFlag[3]) {
                        width = x - left;
                        height = y - top;
                    } else if (dotFlag[4]) {
                        height = y - top;
                    } else if (dotFlag[5]) {
                        width = width + (left - x);
                        height = y - top;
                        left = x;
                    } else if (dotFlag[6]) {
                        width = width + (left - x);
                        left = x;
                    } else if (dotFlag[7]) {
                        width = width + (left - x);
                        height = height + (top - y);
                        left = x;
                        top = y;
                    }

                    if (dotFlag[8]) {
                        top = y - height / 2;
                        left = x - width / 2;
                        if (top < imageTop) top = imageTop;
                        if (top + height > imageBottom) top = imageBottom - height;
                        if (left < imageLeft) left = imageLeft;
                        if (left + width > imageRight) left = imageRight - width;
                    } else {
                        if (top > topBound) top = topBound;
                        if (left > leftBound) left = leftBound;
                        if (height < 1 / scaleRatio) height = 1 / scaleRatio;
                        if (width < 1 / scaleRatio) width = 1 / scaleRatio;
                    }

                    let trueLeft = Math.round((left - imageLeft) * scaleRatio);
                    let trueTop = Math.round((top - imageTop) * scaleRatio);
                    let trueWidth = Math.round(width * scaleRatio);
                    let trueHeight = Math.round(height * scaleRatio);
    
                    legend[0].value = trueLeft
                    legend[1].value = trueTop
                    legend[2].value = trueWidth
                    legend[3].value = trueHeight
                    size[0].innerHTML = trueWidth
                    size[1].innerHTML = trueHeight

                    rect.style.top = top + 'px';
                    rect.style.left = left + 'px';
                    rect.style.width = width + 'px';
                    rect.style.height = height + 'px';

                    setRect({ width: width, height: height, top: (top - imageTop), left: (left - imageLeft) }, scaleRatio);
                }

                return false;
            }

            for (let i = 0; i < dotFlag.length; i++) {
                dot[i].onmousedown = (e) => {
                    if (!editMode) return true;
                    dotFlag[i] = true;
                    document.body.style.cursor = cursor[i];
                    container.style.cursor = cursor[i];
                    rect.style.cursor = cursor[i];
                    for (let j = 0; j < dot.length; j++) {
                        dot[j].style.cursor = cursor[i];
                    }
                }
                dot[i].ontouchstart = (e) => {
                    if (!editMode) return true;
                    e.preventDefault();
                    e.stopPropagation();
                    dotFlag[i] = true;
                    document.body.style.cursor = cursor[i];
                    container.style.cursor = cursor[i];
                    rect.style.cursor = cursor[i];
                    for (let j = 0; j < dot.length; j++) {
                        dot[j].style.cursor = cursor[i];
                    }
                }
            }

            const onMouseUp = (e) => {
                if (!editMode) return true;
                document.body.style.cursor = 'default';
                container.style.cursor = 'default';
                rect.style.cursor = 'default';
                for (let i = 0; i < dotFlag.length; i++) {
                    dotFlag[i] = false;
                    dot[i].style.cursor = cursor[i];
                }

                let width = parseFloat(rect.style.width);
                let height = parseFloat(rect.style.height);

                let offsetWidth = Math.floor(-16 - (60 - width) * 16 / 30);
                let offsetHeight = Math.floor(-16 - (60 - height) * 16 / 30);

                if (offsetWidth < -32) offsetWidth = -32;
                if (offsetHeight < -32) offsetHeight = -32;

                if (height <= 60) {
                    for (let i = 0; i < 3; i++) {
                        dot[i + (i * (i - 1) * 2.5)].style.top = offsetHeight + 'px';
                        dot[i + 3].style.bottom = offsetHeight + 'px';
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        dot[i + (i * (i - 1) * 2.5)].style.top = '-16px';
                        dot[i + 3].style.bottom = '-16px';
                    }
                }

                if (width <= 60) {
                    for (let i = 0; i < 3; i++) {
                        dot[i + 1].style.right = offsetWidth + 'px';
                        dot[i + 5].style.left = offsetWidth + 'px';
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        dot[i + 1].style.right = '-16px';
                        dot[i + 5].style.left = '-16px';
                    }
                }
            }

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onMouseMove);
            window.addEventListener('touchend', onMouseUp);
            window.addEventListener('resize', initializeRect);
            legend.forEach((element) => {
                element.addEventListener('input', onLegendInput)
            })

            return () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                window.removeEventListener('touchmove', onMouseMove);
                window.removeEventListener('touchend', onMouseUp);
                window.removeEventListener('resize', initializeRect);
                legend.forEach((element) => {
                    element.removeEventListener('input', onLegendInput)
                })
            };
        }
    }, [editMode, resetRef, onRotationRef, state]);

    return (
        <div ref={contRef} className={`rectangle-container ${editMode ? 'z-50' : ''} ${className}`}>
            <div className={`rectangle-legend ${editMode ? 'z-60' : 'hide'}`}>
                <div className='rectangle-legend-group'>
                    <div className='rectangle-legend-group-container'>
                        <div className='rectangle-legend-group-container-label'>X:</div>
                        <input ref={legendX} id='legend-x' className='rectangle-legend-group-container-input' type='text' maxLength='5' />
                    </div>
                    <div className='rectangle-legend-group-container'>
                        <div className='rectangle-legend-group-container-label'>Y:</div>
                        <input ref={legendY} id='legend-y' className='rectangle-legend-group-container-input' type='text' maxLength='5' />
                    </div>
                </div>
                <div className='rectangle-legend-group'>
                    <div className='rectangle-legend-group-container'>
                        <div className='rectangle-legend-group-container-label'>W:</div>
                        <input ref={legendW} id='legend-w' className='rectangle-legend-group-container-input' type='text' maxLength='5' />
                    </div>
                    <div className='rectangle-legend-group-container'>
                        <div className='rectangle-legend-group-container-label'>H:</div>
                        <input ref={legendH} id='legend-h' className='rectangle-legend-group-container-input' type='text' maxLength='5' />
                    </div>
                </div>
            </div>
            <div className={`rectangle-size ${editMode ? 'hide' : ''}`}>
                    <div className='rectangle-size-container'>
                        <div className='rectangle-size-container-label'>W:</div>
                        <div ref={sizeW} className='rectangle-size-container-value' />
                    </div>
                    <div className='rectangle-size-container'>
                        <div className='rectangle-size-container-label'>H:</div>
                        <div ref={sizeH} className='rectangle-size-container-value' />
                    </div>
            </div>
            <div ref={rectRef} className={`rectangle ${hide ? 'hide' : ''}`}>
                <div ref={dotRef1} className={`rectangle-container-1 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-1'></div>
                </div>
                <div ref={dotRef2} className={`rectangle-container-2 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-2'></div>
                </div>
                <div ref={dotRef3} className={`rectangle-container-3 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-3'></div>
                </div>
                <div ref={dotRef4} className={`rectangle-container-4 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-4'></div>
                </div>
                <div ref={dotRef5} className={`rectangle-container-5 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-5'></div>
                </div>
                <div ref={dotRef6} className={`rectangle-container-6 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-6'></div>
                </div>
                <div ref={dotRef7} className={`rectangle-container-7 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-7'></div>
                </div>
                <div ref={dotRef8} className={`rectangle-container-8 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-8'></div>
                </div>
                <div ref={dotRef9} className={`rectangle-container-9 ${editMode ? '' : 'hide'}`}>
                    <div className='rectangle-dot-9'></div>
                </div>
            </div>
        </div>
    )
}

export default Rectangle
