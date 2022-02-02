import React, { useEffect, useRef } from 'react'
import './Analyzer.scss'
import Header from './../../components/header/Header';
import CardLgUploader from '../../components/card/large/uploader/section/CardLgUploader';
import Navigation from './../../components/navigation/nav/Navigation';
import CardLgAnalyzer from './../../components/card/large/analyzer/section/CardLgAnalyzer';
import Arrow from './../../assets/component/Arrow';
import { database } from './../../firebase/firebase';
import { getUid } from './../../variables/profile';
import { setAnalyzerHistory } from '../../variables/history';
import { setAnalyzerMeta, getAnalyzerMeta, removeAnalyzerMeta, updateAnalyzerMeta } from './../../variables/meta';
import ModalDelete from '../../components/modal/delete/ModalDelete';
import { getAnalyzerHistory } from './../../variables/history';
import { setImageMD5, setImageSrc, setNaturalRect, getNaturalRect, getImageSrc, getImageRotation } from './../../variables/image';
import { convertRawData } from '../../processor/ImageProcessor';
import ModalSave from '../../components/modal/save/ModalSave';
import { getDataProperty, getRawData, setDataDescription, setDataProperty, setDataSaved, setDataTitle } from '../../variables/data';
import ModalDownload from './../../components/modal/download/ModalDownload';

function Analyzer({ vidPosRef, vidRef, fillRef, anChartPosRef, stateRef, analyzingRef, analyzingProgressRef, rotatingRef, rotatingProgressRef, rotateRef, scanRef, rgbRef, convertingRef }) {
    const ref = useRef();
    const arrowRef = useRef();
    const iconRef = useRef();
    const uploaderRef = useRef();
    const chartRef = useRef();
    const drawRef = useRef();
    const actionRef = useRef();
    const navRef = useRef();
    const openRef = useRef();
    const dataRef = useRef();
    const editRef = useRef();
    const anRef = useRef();
    const chartLoadRef = useRef();
    const openSaveRef = useRef();
    const titleRef = useRef();
    const openDownloadRef = useRef();
    const convRef = useRef();
    const addRef = useRef();
    const vidAddRef = useRef();

    useEffect(() => {
        if (localStorage.getItem('auth') && getUid()) {
            const unsubscribe = database.child(getUid()).child('analyzer/meta').on('value', (snapshot) => {
                if (snapshot) {
                    if (snapshot.val()) {
                        setAnalyzerHistory(snapshot.val());
                        setAnalyzerMeta(snapshot.val());
                    } else {
                        setAnalyzerHistory([]);
                        setAnalyzerMeta([]);
                    }
                    if (navRef.current) navRef.current();
                }
            })

            return () => {
                unsubscribe();
            }
        }
    }, [navRef])

    const onArrowClick = () => {
        if (iconRef.current) iconRef.current.style.filter = stateRef.current ? 'url(#filter_arrow_inverted)' : 'url(#filter_arrow)';
        if (arrowRef.current) arrowRef.current.style.transform = stateRef.current ? 'rotateY(0)' : 'rotateY(180deg)';
        if (uploaderRef.current) uploaderRef.current.style.left = stateRef.current ? '0' : '110vw';
        if (chartRef.current) chartRef.current.style.left = stateRef.current ? '110vw' : '0';
        stateRef.current = !stateRef.current;
    }

    const onProgress = (val) => {
        if (chartLoadRef.current) {
            chartLoadRef.current.style.width = val + '%';
        }
    }

    const onFinish = () => {
        if (anRef.current) anRef.current();
        if (drawRef.current) drawRef.current();
        if (chartLoadRef.current) {
            chartLoadRef.current.style.width = '0';
        }
        if (dataRef.current) setDataProperty(dataRef.current, true);
    }

    const onOpen = (uid) => {
        if (chartLoadRef.current) {
            chartLoadRef.current.style.width = '10%';
        }
        const data = getAnalyzerHistory().find(o => o.id === uid);
        dataRef.current = data;
        database.child(getUid()).child('analyzer/image').child(data.imageHash).once('value', (snapshot) => {
            if (snapshot) {
                setNaturalRect(data.rect);
                setImageSrc(snapshot.val(), null, editRef.current);
                setImageMD5(data.imageHash);
            }
        });
        database.child(getUid()).child('analyzer/data').child(data.id).once('value', (snapshot) => {
            if (snapshot) {
                convertRawData(snapshot.val(), onProgress, onFinish);
            } else {
                if (chartLoadRef.current) {
                    chartLoadRef.current.style.width = '0';
                }
            }
        }).catch((error) => {
            console.log(error);
            if (chartLoadRef.current) {
                chartLoadRef.current.style.width = '0';
            }
        })
    }

    const onDelete = (uid) => {
        dataRef.current = getAnalyzerHistory().find(o => o.id === uid);
        if (openRef.current) openRef.current(true);
    }

    const onDeleteOk = () => {
        const data = getAnalyzerHistory().filter(o => o.imageHash === dataRef.current.imageHash);
        const currentId = dataRef.current.id;
        removeAnalyzerMeta(dataRef.current);
        database.child(getUid()).child('analyzer/data').child(dataRef.current.id).remove();
        database.child(getUid()).child('analyzer/meta').set(getAnalyzerMeta(), (e) => {
            if (e) {
                console.log(e);
            } else {
                if (currentId === getDataProperty().id) setDataSaved(false);
                if (anRef.current) anRef.current();
            }
        }).catch(error => console.log(error));
        if (data.length === 1) {
            database.child(getUid()).child('analyzer/image').child(dataRef.current.imageHash).remove();
        }
    }

    const onDownload = () => {
        titleRef.current = getDataProperty().title;
        if (openDownloadRef) openDownloadRef.current(true);
    }

    const onSave = () => {
        if (openSaveRef.current) openSaveRef.current(true);
    }

    const onDownloadOk = (title) => {
        if (getRawData().length === 0) return;
        let csv;
        for (let i = 0; i < getRawData().length; i++) {
            if (i === 0) {
                csv = i + ',' + getRawData()[i].join(',');
            } else {
                csv += '\n' + i + ',' + getRawData()[i].join(',');
            }
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([csv]));
        link.download = title + '.csv';
        link.style = 'display: none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const onSaveOk = () => {
        setDataSaved(true);
        if (actionRef) actionRef.current();
        if (getRawData().length === 0) return;
        const meta = {
            id: getDataProperty().id,
            imageHash: getDataProperty().imageHash,
            title: getDataProperty().title === '' ? 'Data' : getDataProperty().title,
            description: getDataProperty().description,
            date: getDataProperty().date,
            time: getDataProperty().time,
            rect: getNaturalRect(),
            rotation: getImageRotation()
        }
        updateAnalyzerMeta(meta);
        database.child(getUid()).child('analyzer/meta').set(getAnalyzerMeta()).catch(error => console.log(error));
        database.child(getUid()).child('analyzer/data').child(meta.id).set(getRawData()).catch(error => console.log(error));
        database.child(getUid()).child('analyzer/image').child(meta.imageHash).set(getImageSrc()).catch(error => console.log(error));
    }

    const onTitleChange = (e) => {
        setDataTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setDataDescription(e.target.value);
    }

    return (
        <div className='analyzer'>
            <ModalDelete dataRef={dataRef} openRef={openRef} onOk={onDeleteOk} />
            <ModalSave openSaveRef={openSaveRef} onOk={onSaveOk} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} />
            <ModalDownload titleRef={titleRef} openDownloadRef={openDownloadRef} onOk={onDownloadOk} />
            <Header className='analyzer-header' hideProfile={true} shown={'spectrometer'} />
            <Navigation action='spectrometer' bodyRef={ref} historyType='analyzer' navRef={navRef} openRef={openRef} onOpen={onOpen} onDelete={onDelete} />
            <div className='analyzer-section' >
                <div ref={ref} className='analyzer-helper'></div>
                <div className='analyzer-section-container'>
                    <div ref={uploaderRef} className='analyzer-section-uploader' style={{ left: stateRef.current ? '110vw' : '0' }}>
                        <CardLgUploader vidPosRef={vidPosRef} vidRef={vidRef} vidAddRef={vidAddRef} addRef={addRef} convertingRef={convertingRef} convRef={convRef} editRef={editRef} drawRef={drawRef} actionRef={actionRef} analyzingRef={analyzingRef} onArrowClick={onArrowClick} analyzingProgressRef={analyzingProgressRef} rotatingProgressRef={rotatingProgressRef} rotatingRef={rotatingRef} rotateRef={rotateRef} scanRef={scanRef} />
                    </div>
                    <div ref={chartRef} className='analyzer-section-chart' style={{ left: stateRef.current ? '0' : '110vw' }}>
                        <CardLgAnalyzer onDownload={onDownload} onSave={onSave} rgbRef={rgbRef} fillRef={fillRef} anChartPosRef={anChartPosRef} drawRef={drawRef} actionRef={actionRef} anRef={anRef} chartLoadRef={chartLoadRef} bodyRef={ref} />
                    </div>
                    <div ref={arrowRef} className='analyzer-section-arrow' style={{ transform: stateRef.current ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                        <Arrow ref={iconRef} className='analyzer-section-arrow-icon' filter={stateRef.current ? 'url(#filter_arrow)' : 'url(#filter_arrow_inverted)'} onClick={onArrowClick} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analyzer
