import React, { useEffect, useState } from 'react'
import './CardLgAnalyzerHeader.scss'
import AnalyzerMono from './../../../../../assets/component/AnalyzerMono';
import Save from './../../../../../assets/component/Save';
import Download from './../../../../../assets/component/Download';
import { getDataProperty, getRawData } from '../../../../../variables/data';
import FillSquare from './../../../../../assets/component/FillSquare';
import MenuDot from './../../../../../assets/component/MenuDot';
import { DATA_LIST } from '../../../../../constants/constant';
import Done from './../../../../../assets/component/Done';
import DropdownMenu from './../../../../dropdown/menu/DropdownMenu';

function CardLgAnalyzerHeader({ onFill, onSave, onDownload, actionRef, fillRef, bodyRef, rgbRef, drawRef }) {
    const [state, setState] = useState(false);
    const [fill, setFill] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (actionRef) actionRef.current = () => {
            setState(!state);
        }

        DATA_LIST[0].iconIndex = rgbRef && rgbRef.current.red ? 0 : undefined;
        DATA_LIST[1].iconIndex = rgbRef && rgbRef.current.green ? 0 : undefined;
        DATA_LIST[2].iconIndex = rgbRef && rgbRef.current.blue ? 0 : undefined;
        DATA_LIST[3].iconIndex = rgbRef && rgbRef.current.total ? 0 : undefined;

        const onBodyClick = () => {
            if (showMenu) setShowMenu(!showMenu);
        }

        const body = bodyRef ? bodyRef.current : undefined;
        if (body) body.addEventListener('click', onBodyClick);

        return () => {
            if (body) body.removeEventListener('click', onBodyClick);
        }
    }, [actionRef, state, setShowMenu, bodyRef, showMenu, rgbRef])

    const onClickFill = (e) => {
        setFill(!fill);
        if (onFill) onFill();
    }

    const onSelectData = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    const onActionSelected = (index) => {
        switch (index) {
            case 0:
                if (rgbRef) rgbRef.current.red = !rgbRef.current.red;
                break;
            case 1:
                if (rgbRef) rgbRef.current.green = !rgbRef.current.green;
                break;
            case 2:
                if (rgbRef) rgbRef.current.blue = !rgbRef.current.blue;
                break;
            default:
                if (rgbRef) rgbRef.current.total = !rgbRef.current.total;
                break;
        }
        if (drawRef) drawRef.current();
    }

    return (
        <div className='card-lg-analyzer-header'>
            <div className='card-lg-analyzer-header-container-1'>
                <AnalyzerMono className='card-lg-analyzer-header-logo' />
                <div className='card-lg-analyzer-header-title'>Image Analyzer</div>
            </div>
            <div className='card-lg-analyzer-header-container-2'>
                <FillSquare
                    className={`card-lg-analyzer-header-action-icon ${getRawData().length > 0 ? '' : 'disabled'}`}
                    colorClass={`card-lg-analyzer-header-action-icon-color ${getRawData().length > 0 ? '' : 'disabled-color'}`}
                    title={!fillRef.current ? 'Fill area below curve' : 'Hide area below curve'}
                    fill={fillRef.current}
                    onClick={getRawData().length > 0 ? onClickFill : undefined}
                />
                <Save
                    className={`card-lg-analyzer-header-action-icon ${getRawData().length > 0 && localStorage.getItem('auth') && !getDataProperty().saved ? '' : 'disabled'}`}
                    colorClass={`card-lg-analyzer-header-action-icon-color ${getRawData().length > 0 && localStorage.getItem('auth') && !getDataProperty().saved ? '' : 'disabled-color'}`}
                    title={getRawData().length === 0 ? 'There is no data to be saved' : !localStorage.getItem('auth') ? 'Please login to be able to save your work' : getDataProperty().saved ? 'Already saved' : 'Save as history'}
                    onClick={(getRawData().length > 0 && localStorage.getItem('auth') && !getDataProperty().saved) ? onSave : undefined}
                />
                <Download
                    className={`card-lg-analyzer-header-action-icon ${getRawData().length > 0 ? '' : 'disabled'}`}
                    colorClass={`card-lg-analyzer-header-action-icon-color ${getRawData().length > 0 ? '' : 'disabled-color'}`}
                    title={getRawData().length > 0 ? 'Download as CSV' : 'There is no data to download'}
                    onClick={getRawData().length > 0 ? onDownload : undefined}
                />
                <MenuDot
                    className={`card-lg-analyzer-header-action-icon card-lg-analyzer-header-action-icon-dot ${getRawData().length > 0 ? '' : 'disabled'}`}
                    colorClass={`card-lg-analyzer-header-action-icon-color ${getRawData().length > 0 ? '' : 'disabled-color'}`}
                    title='Select data to be displayed'
                    fill={fillRef.current}
                    onClick={getRawData().length > 0 ? onSelectData : undefined}
                />
                <DropdownMenu
                    className='card-lg-analyzer-header-menu-dropdown'
                    shown={showMenu}
                    setShown={setShowMenu}
                    itemList={DATA_LIST}
                    iconList={[Done]}
                    onItemSelected={onActionSelected}
                    tooltip={[
                        'Show red data',
                        'Show green data',
                        'Show blue data'
                    ]}
                />
            </div>
        </div>
    )
}

export default CardLgAnalyzerHeader
