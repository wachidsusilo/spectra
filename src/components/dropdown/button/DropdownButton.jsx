import React, { useCallback, useEffect, useRef, useState } from 'react'
import './DropdownButton.scss'
import ArrowDropdown from './../../../assets/component/ArrowDropdown';
import DropdownMenu from './../menu/DropdownMenu';
import Cpu from './../../../assets/component/Cpu';
import { getActiveDevice, getDeviceList, setActiveDevice } from './../../../variables/device';
import Socket from './../../../socket/socket';

function DropdownButton({ showDropdown, setShowDropdown, showMenu, setShowMenu, openRef, idRef }) {
    const [state, setState] = useState();
    const ref = useRef();

    const updateIndicator = useCallback(() => {
        const indicator = ref.current;
        if (getActiveDevice()) {
            if (Socket.isOpen()) {
                if (getActiveDevice().busy) {
                    indicator.style.background = '#ff6d00';
                    indicator.title = 'busy';
                } else {
                    indicator.style.background = '#0091ea';
                    indicator.title = 'ready';
                }
            } else {
                indicator.style.background = '#bdbdbd';
                indicator.title = 'offline';
            }
        } else {
            if (Socket.isOpen()) {
                indicator.style.background = '#00c853';
                indicator.title = 'online';
            } else {
                indicator.style.background = '#bdbdbd';
                indicator.title = 'offline';
            }
        }
    }, [])

    useEffect(() => {
        updateIndicator();
        Socket.onConnectionChanged = updateIndicator;
        Socket.onDeviceListUpdated = () => {
            updateIndicator();
            setState(!state);
        }
        return () => {
            Socket.onConnectionChanged = undefined;
            Socket.onDeviceListUpdated = undefined;
        }
    }, [updateIndicator, state])

    const onClickDropdown = () => {
        if (getDeviceList().length > 0) setShowDropdown(!showDropdown);
        if (showMenu) setShowMenu(!showMenu);
    };

    const onItemSelected = (index) => {
        if (getDeviceList()[index].secured) {
            if (idRef) idRef.current = getDeviceList()[index].id;
            if (openRef) openRef.current(true);
        } else {
            setActiveDevice(index);
            updateIndicator();
            setState(!state);
        }
    };

    return (
        <div className='dropdown-button' onClick={onClickDropdown}>
            <div ref={ref} className='dropdown-button-indicator' onClick={(e) => { e.preventDefault(); e.stopPropagation() }}></div>
            <div className='dropdown-button-title'>{getActiveDevice() ? getActiveDevice().title : (getDeviceList().length > 0 ? '- device -' : '- no-device -')}</div>
            <ArrowDropdown className='dropdown-button-icon' colorClass='dropdown-button-icon-color' />
            <DropdownMenu shown={showDropdown} setShown={setShowDropdown} itemList={getDeviceList()} iconList={[Cpu]} onItemSelected={onItemSelected} />
        </div>
    )
}

export default DropdownButton
