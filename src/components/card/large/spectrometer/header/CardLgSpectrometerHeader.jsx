import React, { useEffect, useRef, useState } from 'react'
import './CardLgSpectrometerHeader.scss'
import SpectrometerMono from '../../../../../assets/component/SpectrometerMono';
import Play from '../../../../../assets/component/Play';
import Save from '../../../../../assets/component/Save';
import Download from '../../../../../assets/component/Download';
import MenuDot from '../../../../../assets/component/MenuDot';
import DropdownMenu from './../../../../dropdown/menu/DropdownMenu';
import { ACTION_LIST } from './../../../../../constants/constant';
import DropdownButton from '../../../../dropdown/button/DropdownButton';
import { getSpectra, getSpectraProperties } from '../../../../../variables/spectra';
import { getActiveDevice } from './../../../../../variables/device';
import Socket from './../../../../../socket/socket';
import FillSquare from './../../../../../assets/component/FillSquare';

function CardLgSpectrometerHeader({ bodyRef, openRef, idRef, fillRef, headRef, drawRef, onSave, onDownload, loadRef }) {
    const [state, setState] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const runRef = useRef();

    useEffect(() => {
        if (headRef) headRef.current = () => {
            setState(!state);
        }
        Socket.onDeviceStatusUpdated = () => {
            if (runRef.current) runRef.current(getActiveDevice() && getActiveDevice().busy);
        };
        const body = bodyRef.current;
        const onClick = () => {
            if (showDropdown) setShowDropdown(!showDropdown);
            if (showMenu) setShowMenu(!showMenu);
        }
        if (body) body.addEventListener('click', onClick);
        return () => {
            if (body) body.removeEventListener('click', onClick);
        }
    }, [bodyRef, showDropdown, showMenu, state, headRef])

    const onClickMenu = () => {
        setShowMenu(!showMenu);
        if (showDropdown) setShowDropdown(!showDropdown);
    }

    const onRun = () => {
        if (getActiveDevice()) {
            Socket.device.run(getActiveDevice().id);
            if(loadRef) loadRef.current.style.transition = 'width 1s linear';
        }
    }

    const onFill = () => {
        fillRef.current = !fillRef.current;
        drawRef.current();
        setState(!state);
    }

    const onActionSelected = (index) => {
        switch (index) {
            case 0:
                if (getActiveDevice() && Socket.isOpen()) onRun();
                break;
            case 1:
                if (getSpectra().length > 0) onFill();
                break;
            case 2:
                if (getSpectra().length > 0 && localStorage.getItem('auth') && !getSpectraProperties().saved) onSave();
                break;
            default:
                if (getSpectra().length > 0) onDownload();
                break;
        }
    }

    return (
        <div className='card-lg-spectrometer-header' onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <div className='card-lg-spectrometer-header-container-1'>
                <SpectrometerMono className='card-lg-spectrometer-header-logo' />
                <div className='card-lg-spectrometer-header-title'>Realtime Spectrometer</div>
            </div>
            <div className='card-lg-spectrometer-header-container-2'>
                <DropdownButton showMenu={showMenu} setShowMenu={setShowMenu} showDropdown={showDropdown} setShowDropdown={setShowDropdown} openRef={openRef} idRef={idRef} />
            </div>
            <div className='card-lg-spectrometer-header-container-3'>
                <div className='card-lg-spectrometer-header-action-container'>
                    <Play
                        className={`card-lg-spectrometer-header-action-icon ${getActiveDevice() && Socket.isOpen() ? '' : 'disabled'}`}
                        colorClass={`card-lg-spectrometer-header-action-icon-color ${getActiveDevice() && Socket.isOpen() ? '' : 'disabled-color'}`}
                        title={!Socket.isOpen() ? 'You are offline' : getActiveDevice() ? 'Collect data' : 'Please select a device'}
                        onClick={getActiveDevice() && Socket.isOpen() ? onRun : undefined}
                        runRef={runRef}
                    />
                    <FillSquare
                        className={`card-lg-spectrometer-header-action-icon ${getSpectra().length > 0 ? '' : 'disabled'}`}
                        colorClass={`card-lg-spectrometer-header-action-icon-color ${getSpectra().length > 0 ? '' : 'disabled-color'}`}
                        title={!fillRef.current ? 'Fill area below curve' : 'Hide area below curve'}
                        fill={fillRef.current}
                        onClick={getSpectra().length > 0 ? onFill : undefined}
                    />
                    <Save
                        className={`card-lg-spectrometer-header-action-icon ${getSpectra().length > 0 && localStorage.getItem('auth') && !getSpectraProperties().saved ? '' : 'disabled'}`}
                        colorClass={`card-lg-spectrometer-header-action-icon-color ${getSpectra().length > 0 && localStorage.getItem('auth') && !getSpectraProperties().saved ? '' : 'disabled-color'}`}
                        title={getSpectra().length === 0 ? 'There is no data to be saved' : !localStorage.getItem('auth') ? 'Please login to be able to save your work' : getSpectraProperties.saved ? 'Already saved' : 'Save as history'}
                        onClick={getSpectra().length > 0 && localStorage.getItem('auth') && !getSpectraProperties().saved ? onSave : undefined}
                    />
                    <Download
                        className={`card-lg-spectrometer-header-action-icon ${getSpectra().length > 0 ? '' : 'disabled'}`}
                        colorClass={`card-lg-spectrometer-header-action-icon-color ${getSpectra().length > 0 ? '' : 'disabled-color'}`}
                        title={getSpectra().length > 0 ? 'Download as CSV' : 'There is no data to download'}
                        onClick={getSpectra().length > 0 ? onDownload : undefined}
                    />
                </div>
                <MenuDot className='card-lg-spectrometer-header-menu-icon' colorClass='card-lg-spectrometer-header-menu-icon-color' onClick={onClickMenu} />
                <DropdownMenu
                    className='card-lg-spectrometer-header-menu-dropdown'
                    shown={showMenu}
                    setShown={setShowMenu}
                    disabled={[
                        !(getActiveDevice() && Socket.isOpen()),
                        !(getSpectra().length > 0),
                        !(getSpectra().length > 0 && localStorage.getItem('auth') && !getSpectraProperties().saved),
                        !(getSpectra().length > 0)
                    ]}
                    itemList={ACTION_LIST}
                    iconList={[Play, FillSquare, Save, Download]}
                    onItemSelected={onActionSelected}
                    tooltip={[
                        (!Socket.isOpen() ? 'You are offline' : getActiveDevice() ? 'Collect data' : 'Please select a device'),
                        (!fillRef.current ? 'Fill area below curve' : 'Hide area below curve'),
                        (getSpectra().length === 0 ? 'There is no data to be saved' : !localStorage.getItem('auth') ? 'Please login to be able to save your work' : getSpectraProperties.saved ? 'Already saved' : 'Save as history'),
                        (getSpectra().length > 0 ? 'Download as CSV' : 'There is no data to download')
                    ]}
                    iconProp={[undefined, { fill: fillRef.current }, undefined, undefined]}
                />
            </div>
        </div>
    )
}

export default CardLgSpectrometerHeader
