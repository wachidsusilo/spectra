import React, { useEffect, useRef } from 'react'
import './Spectrometer.scss'
import CardLgSpectrometer from '../../components/card/large/spectrometer/section/CardLgSpectrometer';
import Header from '../../components/header/Header';
import Navigation from './../../components/navigation/nav/Navigation';
import { HISTORY_TYPE } from './../../constants/constant';
import ModalAuth from '../../components/modal/auth/ModalAuth';
import { getDeviceList } from '../../variables/device';
import { setActiveDevice } from './../../variables/device';
import Socket from './../../socket/socket';
import { getSpectra, getSpectraProperties, setSpectra, setSpectraDescription, setSpectraProperty, setSpectraSaved, setSpectraTitle } from '../../variables/spectra';
import ModalSave from '../../components/modal/save/ModalSave';
import { getSpectrometerMeta, removeSpectrometerMeta, setSpectrometerMeta, updateSpectrometerMeta } from '../../variables/meta';
import { database } from '../../firebase/firebase';
import { getUid } from '../../variables/profile';
import ModalDownload from '../../components/modal/download/ModalDownload';
import ModalDelete from '../../components/modal/delete/ModalDelete';
import { getSpectrometerHistory, setSpectrometerHistory } from './../../variables/history';

function Spectrometer({ spFillRef, spChartPosRef }) {
    const ref = useRef();
    const openRef = useRef();
    const openSaveRef = useRef();
    const openDownloadRef = useRef();
    const openDeleteRef = useRef();
    const idRef = useRef();
    const drawRef = useRef();
    const headRef = useRef();
    const titleRef = useRef();
    const dataRef = useRef();
    const navRef = useRef();
    const loadRef = useRef();

    useEffect(() => {
        Socket.onDataReceived = () => {
            setSpectraSaved(false);
            if (loadRef) {
                loadRef.current.style.transition = 'none';
                loadRef.current.style.width = 0;
            }
            if (drawRef.current) drawRef.current();
            if (headRef) headRef.current();
        }

        Socket.onProress = (val) => {
            if (loadRef) loadRef.current.style.width = val + '%';
        }

        if (localStorage.getItem('auth') && getUid()) {
            const unsubscribe = database.child(getUid()).child('spectrometer/meta').on('value', (snapshot) => {
                if (snapshot) {
                    if (snapshot.val()) {
                        setSpectrometerHistory(snapshot.val());
                        setSpectrometerMeta(snapshot.val());
                    } else {
                        setSpectrometerHistory([]);
                        setSpectrometerMeta([]);
                    }
                    if (navRef.current) navRef.current();
                }
            })

            return () => {
                unsubscribe();
            }
        }
    }, []);

    const onAuthorized = () => {
        const index = getDeviceList().findIndex(o => o.id === idRef.current);
        if (index >= 0) {
            setActiveDevice(index);
            if (headRef.current) headRef.current();
        }
    }

    const onOpen = (uid) => {
        if (loadRef) loadRef.current.style.width = 0;
        const data = getSpectrometerHistory().find(o => o.id === uid);
        database.child(getUid()).child('spectrometer/data').child(data.id).once('value', (snapshot) => {
            if (snapshot) {
                setSpectra(snapshot.val());
                setSpectraProperty(data, true);
                if (drawRef.current) drawRef.current();
                if (headRef) headRef.current();
            }
        }).catch(e => console.log(e));
    }

    const onDelete = (uid) => {
        dataRef.current = getSpectrometerHistory().find(o => o.id === uid);
        if (openDeleteRef.current) openDeleteRef.current(true);
    }

    const onSave = () => {
        if (openSaveRef.current) openSaveRef.current(true);
    }

    const onDownload = () => {
        titleRef.current = getSpectraProperties().title;
        if (openDownloadRef) openDownloadRef.current(true);
    }

    const onDeleteOk = () => {
        const currentId = dataRef.current.id;
        removeSpectrometerMeta(dataRef.current);
        database.child(getUid()).child('spectrometer/data').child(dataRef.current.id).remove();
        database.child(getUid()).child('spectrometer/meta').set(getSpectrometerMeta(), (e) => {
            if (e) {
                console.log(e);
            } else {
                if (currentId === getSpectraProperties().id) {
                    setSpectraSaved(false);
                    if (headRef) headRef.current();
                }
            }
        }).catch(error => console.log(error));
    }

    const onSaveOk = () => {
        setSpectraSaved(true);
        if (headRef) headRef.current();
        if (getSpectra().length === 0) return;
        const meta = {
            id: getSpectraProperties().id,
            title: getSpectraProperties().title === '' ? 'Data' : getSpectraProperties().title,
            description: getSpectraProperties().description,
            date: getSpectraProperties().date,
            time: getSpectraProperties().time
        }
        updateSpectrometerMeta(meta);
        database.child(getUid()).child('spectrometer/meta').set(getSpectrometerMeta()).catch(error => console.log(error));
        database.child(getUid()).child('spectrometer/data').child(meta.id).set(getSpectra()).catch(error => console.log(error));
    }

    const onDownloadOk = (title) => {
        if (getSpectra().length === 0) return;
        let csv;
        for (let i = 0; i < getSpectra().length; i++) {
            if (i === 0) {
                csv = i + ',' + getSpectra()[i];
            } else {
                csv += '\n' + i + ',' + getSpectra()[i];
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

    const onTitleChange = (e) => {
        setSpectraTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setSpectraDescription(e.target.value);
    }

    return (
        <div className='spectrometer'>
            <ModalAuth openRef={openRef} idRef={idRef} onAuthorized={onAuthorized} />
            <ModalSave openSaveRef={openSaveRef} onOk={onSaveOk} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} />
            <ModalDownload titleRef={titleRef} openDownloadRef={openDownloadRef} onOk={onDownloadOk} />
            <ModalDelete dataRef={dataRef} openRef={openDeleteRef} onOk={onDeleteOk} />
            <Header className='spectrometer-header' hideProfile={true} shown={'analyzer'} />
            <Navigation action='analyzer' historyType={HISTORY_TYPE[0]} navRef={navRef} bodyRef={ref} onDelete={onDelete} onOpen={onOpen} />
            <div className='spectrometer-section' >
                <div ref={ref} className='spectrometer-helper'></div>
                <CardLgSpectrometer loadRef={loadRef} bodyRef={ref} openRef={openRef} idRef={idRef} drawRef={drawRef} spFillRef={spFillRef} spChartPosRef={spChartPosRef} headRef={headRef} onSave={onSave} onDownload={onDownload} />
            </div>
        </div>
    )
}

export default Spectrometer
