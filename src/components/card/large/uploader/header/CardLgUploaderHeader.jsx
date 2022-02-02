import React, { useCallback, useEffect, useRef, useState } from 'react'
import './CardLgUploaderHeader.scss'
import AnalyzerMono from './../../../../../assets/component/AnalyzerMono';
import AddImage from './../../../../../assets/component/AddImage';
import Selection from './../../../../../assets/component/Selection';
import Scan from './../../../../../assets/component/Scan';
import Done from './../../../../../assets/component/Done';
import Progress from './../../../../progress/Progress';
import { getDefaultRect, getImageSrc } from './../../../../../variables/image';
import { analyzeImage, rotateImage } from './../../../../../processor/ImageProcessor';
import Rotate from './../../../../../assets/component/Rotate';
import { clearData } from '../../../../../variables/data';
import Swap from './../../../../../assets/component/Swap';
import Video from './../../../../../assets/component/Video';
import SelectNone from './../../../../../assets/component/SelectNone';
import SelectAll from './../../../../../assets/component/SelectAll';
import Delete from '../../../../../assets/component/Delete';
import MenuDot from '../../../../../assets/component/MenuDot';
import DropdownMenu from '../../../../dropdown/menu/DropdownMenu';
import EditVideo from './../../../../../assets/component/EditVideo';
import { isVideoFramesAvailable } from '../../../../../variables/video';
import LoadDefault from '../../../../../assets/component/LoadDefault';
import SaveTemplate from '../../../../../assets/component/SaveTemplate';

function CardLgUploaderHeader({ updateSelectRef, vidPosRef, headerStateRef, selectedRef, startRef, lengthRef, vidRef, vidAddRef, addRef, convertingRef, convRef, drawRef, actionRef, editMode, setEditMode, onVideoDone, onImageSelected, onVideoSelected, onConvert, analyzingRef, analyzingProgressRef, rotatingRef, rotatingProgressRef, scanRef, rotateRef, imgRef, onRotationRef, onArrowClick, onCancelExtract, onSelectNone, onSelectAll, onVideoSelection, onVideoCancel, onSetDefault, onLoadDefault }) {
    const [state, setState] = useState(false)
    const [showMenu, setShowMenu] = useState(false);
    const actionContainerRef = useRef()
    const lengthLabelRef = useRef()
    const frameLabelRef = useRef()
    const ovRef = useRef()
    const selectRef = useRef(false)

    const updateSelectMode = useCallback(() => {
        for (let i = vidPosRef.current.startFrame; i < vidPosRef.current.endFrame; i++) {
            if (!vidRef.current.selected[i]) {
                selectRef.current = false
                return
            }
        }
        selectRef.current = true
    }, [vidPosRef, vidRef])

    updateSelectMode()

    const getActionWidth = useCallback(() => {
        return vidRef && vidRef.current.active ? vidRef.current.loaded ? window.innerWidth > 500 ? '350px' : '215px' : '40px' : 0
    }, [vidRef])

    useEffect(() => {
        const actionContainer = actionContainerRef.current
        const overlay = ovRef.current

        if (updateSelectRef) updateSelectRef.current = () => {
            updateSelectMode()
            setState(s => !s)
        }

        if (headerStateRef) headerStateRef.current = (updateView) => {
            setState(s => !s)
            if (updateView) updateView()
        }

        const onResize = (e) => {
            if (e.target.innerWidth > 500) setShowMenu(s => { if (s) return !s })
            if (actionContainer) actionContainer.style.width = getActionWidth()
            if (e.target.innerWidth > 500) {
                if (lengthLabelRef.current) lengthLabelRef.current.innerHTML = 'Length:'
                if (frameLabelRef.current) frameLabelRef.current.innerHTML = 'Frame:'
            } else {
                if (lengthLabelRef.current) lengthLabelRef.current.innerHTML = 'L'
                if (frameLabelRef.current) frameLabelRef.current.innerHTML = 'F'
            }
        }

        const onTransitionEnd = () => {
            if (overlay.classList.contains('card-lg-uploader-header-action-video-container-overlay-hide')) overlay.style.zIndex = -1
        }

        if (overlay) overlay.addEventListener('transitionend', onTransitionEnd)
        window.addEventListener('resize', onResize)

        return () => {
            if (updateSelectRef) updateSelectRef.current = undefined
            if (headerStateRef) headerStateRef.current = undefined
            if (overlay) overlay.removeEventListener('transitionend', onTransitionEnd)
            window.removeEventListener('resize', onResize)

        }
    }, [headerStateRef, getActionWidth, ovRef, updateSelectMode, updateSelectRef])

    const onClickSelection = () => {
        setEditMode(true);
    }

    const onClickDone = () => {
        setEditMode(false);
    }

    const onProgressRotate = (val) => {
        if (rotatingProgressRef.current) {
            rotatingProgressRef.current.title.innerHTML = val + ' %';
            rotatingProgressRef.current.line.style.width = val + '%';
        }
    }

    const onFinishRotate = () => {
        clearData();
        if (drawRef) drawRef.current();
        if (actionRef) actionRef.current();
        if (rotatingRef) rotatingRef.current = false;
        if (rotatingProgressRef.current) rotatingProgressRef.current.parent.classList.add('hide');
        if (rotateRef.current) rotateRef.current.classList.remove('hide');
        if (onRotationRef) onRotationRef.current();
    }

    const onClickRotation = async () => {
        if (imgRef) {
            onProgressRotate(0);
            if (rotatingRef) rotatingRef.current = true;
            if (rotatingProgressRef.current) rotatingProgressRef.current.parent.classList.remove('hide');
            if (rotateRef.current) rotateRef.current.classList.add('hide');
            rotateImage(imgRef.current, onProgressRotate, onFinishRotate);
        }
    }

    const onProgressAnalyze = (val) => {
        if (analyzingProgressRef.current) {
            analyzingProgressRef.current.title.innerHTML = val + ' %';
            analyzingProgressRef.current.line.style.width = val + '%';
        }
    }

    const onFinishAnalyze = () => {
        if (analyzingRef) analyzingRef.current = false;
        if (analyzingProgressRef.current) analyzingProgressRef.current.parent.classList.add('hide');
        if (scanRef.current) scanRef.current.classList.remove('hide');
        if (drawRef) {
            drawRef.current();
            if (actionRef) actionRef.current();
            setTimeout(() => {
                if (onArrowClick) onArrowClick();
            }, 200);
        }
    }

    const onClickAnalyze = () => {
        onProgressAnalyze(0);
        if (analyzingRef) analyzingRef.current = true;
        if (analyzingProgressRef.current) analyzingProgressRef.current.parent.classList.remove('hide');
        if (scanRef.current) scanRef.current.classList.add('hide');
        analyzeImage(onProgressAnalyze, onFinishAnalyze);
    }

    const onClickSelect = () => {
        if (selectRef.current) {
            selectRef.current = false
            if (onSelectNone) onSelectNone()
        } else {
            selectRef.current = true
            if (onSelectAll) onSelectAll()
        }
    }

    const onClickMenu = () => {
        if (ovRef.current) ovRef.current.style.zIndex = 300
        setShowMenu(!showMenu)
    }

    const onActionSelected = (index) => {
        switch (index) {
            case 0:
                if (onVideoDone) onVideoDone()
                break
            case 1:
                if (onVideoCancel) onVideoCancel()
                break
            default:
                onClickSelect()
                break
        }
    }

    const getItemList = () => {
        return [{
            iconIndex: 0,
            title: 'Done'
        }, {
            iconIndex: 1,
            title: 'Cancel'
        }, {
            iconIndex: 2,
            title: selectRef.current ? 'Select none' : 'Select all'
        }]
    }

    return (
        <div className='card-lg-uploader-header'>
            <div className='card-lg-uploader-header-container-1'>
                <AnalyzerMono className='card-lg-uploader-header-logo' />
                <div className='card-lg-uploader-header-title'>Image Analyzer</div>
            </div>
            <div className='card-lg-uploader-header-container-2'>
                <div className='card-lg-uploader-header-action-container' style={{ width: !editMode && (vidRef ? !vidRef.current.active : true) ? '270px' : 0 }}>
                    <Video
                        addRef={vidAddRef} convertingRef={convertingRef}
                        className='card-lg-uploader-header-action-icon'
                        colorClass='card-lg-uploader-header-action-icon-color'
                        title='Upload a Video' onSelected={onVideoSelected}
                    />
                    <AddImage
                        addRef={addRef} convertingRef={convertingRef}
                        className='card-lg-uploader-header-action-icon'
                        colorClass='card-lg-uploader-header-action-icon-color'
                        title='Upload an image' onSelected={onImageSelected}
                    />
                    <Swap
                        convRef={convRef}
                        className='card-lg-uploader-header-action-icon'
                        colorClass='card-lg-uploader-header-action-icon-color'
                        title='Upload an image and convert'
                        onSelected={onConvert}
                    />
                    <EditVideo
                        className={`card-lg-uploader-header-action-icon ${isVideoFramesAvailable() && !convertingRef.current ? '' : 'disabled'}`}
                        colorClass={`card-lg-uploader-header-action-icon-color ${isVideoFramesAvailable() && !convertingRef.current ? '' : 'disabled-color'}`}
                        title={isVideoFramesAvailable() && !convertingRef.current ? 'Reselect frames' : ''}
                        onClick={isVideoFramesAvailable() && !convertingRef.current ? onVideoSelection : undefined}
                    />
                    <Selection
                        className={`card-lg-uploader-header-action-icon ${getImageSrc() && !convertingRef.current ? '' : 'disabled'}`}
                        colorClass={`card-lg-uploader-header-action-icon-color ${getImageSrc() && !convertingRef.current ? '' : 'disabled-color'}`}
                        title={getImageSrc() && !convertingRef.current ? 'Select area' : ''}
                        onClick={getImageSrc() && !convertingRef.current ? onClickSelection : undefined}
                    />
                    <Progress
                        ref={rotatingProgressRef}
                        className={`card-lg-uploader-header-action-icon ${rotatingRef.current ? '' : 'hide'}`}
                        title='Rotating...'
                    />
                    <Rotate
                        ref={rotateRef}
                        className={`card-lg-uploader-header-action-icon ${getImageSrc() && !convertingRef.current ? '' : 'disabled'}`}
                        colorClass={`card-lg-uploader-header-action-icon-color ${getImageSrc() && !convertingRef.current ? '' : 'disabled-color'}`}
                        title={getImageSrc() && !convertingRef.current ? 'Rotate image' : ''}
                        onClick={getImageSrc() && !convertingRef.current ? onClickRotation : undefined}
                    />
                    <Progress
                        ref={analyzingProgressRef}
                        className={`card-lg-uploader-header-action-icon ${analyzingRef.current ? '' : 'hide'}`}
                        title='Analyzing...'
                    />
                    <Scan
                        ref={scanRef}
                        className={`card-lg-uploader-header-action-icon ${getImageSrc() && !convertingRef.current ? '' : 'disabled'}`}
                        parentClass={analyzingRef.current ? 'hide' : ''}
                        colorClass={`card-lg-uploader-header-action-icon-color ${getImageSrc() && !convertingRef.current ? '' : 'disabled-color'}`}
                        title={getImageSrc() && !convertingRef.current ? 'Analyze' : ''}
                        onClick={getImageSrc() && !convertingRef.current ? onClickAnalyze : undefined}
                    />
                </div>
                <div className='card-lg-uploader-header-action-edit-container' style={{width: editMode ? '120px' : 0}}>
                    <LoadDefault
                        className={`card-lg-uploader-header-action-edit-container-icon ${getDefaultRect() ? '' : 'disabled'}`}
                        colorClass={`card-lg-uploader-header-action-edit-container-icon-color ${getDefaultRect() ? '' : 'disabled-color'}`}
                        title={getDefaultRect() ? 'Load default' : 'There is no data to load'}
                        onClick={getDefaultRect() ? onLoadDefault : undefined}
                    />
                    <SaveTemplate
                        className='card-lg-uploader-header-action-edit-container-icon'
                        colorClass='card-lg-uploader-header-action-edit-container-icon-color'
                        title='Set as default'
                        onClick={getImageSrc() ? onSetDefault : undefined}
                    />
                    <Done
                        className='card-lg-uploader-header-action-edit-container-icon'
                        colorClass='card-lg-uploader-header-action-edit-container-icon-color'
                        title='Done'
                        onClick={getImageSrc() ? onClickDone : undefined}
                    />
                </div>
                <div
                    ref={actionContainerRef}
                    className={`card-lg-uploader-header-action-video-container ${state ? '' : ''} ${vidRef && vidRef.current.loaded ? '' : 'card-lg-uploader-header-action-video-container-loading'}`}
                    style={{ width: getActionWidth() }}
                >
                    {vidRef && vidRef.current.loaded ?
                        <>
                            <div className='card-lg-uploader-header-action-video-container-selected'>
                                <div className='card-lg-uploader-header-action-video-container-selected-label'>Selected</div>
                                <div ref={selectedRef} className='card-lg-uploader-header-action-video-container-selected-value'>0</div>
                            </div>
                            <div className={`card-lg-uploader-header-action-video-container-legend`}>
                                <label className='card-lg-uploader-header-action-video-container-legend-container'>
                                    <div ref={frameLabelRef} className='card-lg-uploader-header-action-video-container-legend-label'>{window.innerWidth > 500 ? 'Start:' : 'S'}</div>
                                    <input ref={startRef} className='card-lg-uploader-header-action-video-container-legend-input' type='text' maxLength='6' />
                                </label>
                                <label className='card-lg-uploader-header-action-video-container-legend-container'>
                                    <div ref={lengthLabelRef} className='card-lg-uploader-header-action-video-container-legend-label'>{window.innerWidth > 500 ? 'Length:' : 'L'}</div>
                                    <input ref={lengthRef} className='card-lg-uploader-header-action-video-container-legend-input' type='text' maxLength='6' />
                                </label>
                            </div>
                            <div className='card-lg-uploader-header-action-video-container-action'>
                                {selectRef.current ?
                                    <SelectNone
                                        className='card-lg-uploader-header-action-video-container-action-icon'
                                        colorClass='card-lg-uploader-header-action-video-container-action-icon-color'
                                        title='Select none'
                                        onClick={onClickSelect}
                                    />
                                    :
                                    <SelectAll
                                        className='card-lg-uploader-header-action-video-container-action-icon'
                                        colorClass='card-lg-uploader-header-action-video-container-action-icon-color'
                                        title='Select all'
                                        onClick={onClickSelect}
                                    />
                                }
                                <Delete
                                    className='card-lg-uploader-header-action-video-container-action-icon'
                                    colorClass='card-lg-uploader-header-action-video-container-action-icon-color'
                                    title='Cancel'
                                    onClick={onVideoCancel} />
                                <Done
                                    className='card-lg-uploader-header-action-video-container-action-icon'
                                    colorClass='card-lg-uploader-header-action-video-container-action-icon-color'
                                    title='Done'
                                    onClick={onVideoDone}
                                />
                            </div>
                            <MenuDot
                                className='card-lg-uploader-header-action-icon card-lg-uploader-header-action-video-container-menu'
                                colorClass='card-lg-uploader-header-action-icon-color'
                                title='More'
                                onClick={onClickMenu}
                            />
                            <DropdownMenu
                                className='card-lg-uploader-header-action-video-container-dropdown'
                                shown={showMenu}
                                setShown={setShowMenu}
                                itemList={getItemList()}
                                iconList={[Done, Delete, selectRef.current ? SelectNone : SelectAll]}
                                onItemSelected={onActionSelected}
                            />
                        </>
                        :
                        <Delete
                            className='card-lg-uploader-header-action-video-container-action-icon card-lg-uploader-header-action-video-container-cancel'
                            colorClass='card-lg-uploader-header-action-video-container-action-icon-color'
                            title='Cancel'
                            onClick={onCancelExtract}
                        />
                    }
                    <div
                        ref={ovRef}
                        className={`card-lg-uploader-header-action-video-container-overlay ${showMenu ? '' : 'card-lg-uploader-header-action-video-container-overlay-hide'}`}
                        onClick={showMenu ? onClickMenu : undefined}></div>
                </div>
            </div>
        </div>
    )
}

export default CardLgUploaderHeader
