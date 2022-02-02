import React from 'react'
import './DropdownItem.scss'
import Lock from './../../../assets/component/Lock';

function DropdownItem({ index, icon, iconProp, title, showTooltip, onSelected, secured, disabled, tooltip, light }) {
    const Icon = icon;
    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSelected) onSelected(index);
    }

    return (
        <div className={`dropdown-item ${light ? 'dropdown-item-light' : ''} ${disabled ? '' : 'dropdown-item-enabled'}`} onClick={disabled ? undefined : onClick}>
            {Icon ?
                <Icon className={`dropdown-item-icon ${disabled ? 'disabled' : ''}`} colorClass={`dropdown-item-icon-color ${light ? 'dropdown-item-icon-color-light' : ''} ${disabled ? 'disabled-color' : ''}`} {...iconProp} />
                :
                <div></div>
            }
            {showTooltip ?
                <div className='dropdown-item-title'>
                    <div className={`dropdown-item-title-content ${light ? 'dropdown-item-title-content-light' : ''} ${disabled ? 'dropdown-item-title-content-disabled' : ''}`} title={tooltip ? tooltip : title}>{title}</div>
                    {secured && <Lock className='dropdown-item-title-lock-icon' colorClass='dropdown-item-title-lock-icon-color' />}
                </div>
                :
                <div className='dropdown-item-title'>
                    <div className={`dropdown-item-title-content ${light ? 'dropdown-item-title-content-light' : ''} ${disabled ? 'dropdown-item-title-content-disabled' : ''}`}>{title}</div>
                    {secured && <Lock className='dropdown-item-title-lock-icon' colorClass='dropdown-item-title-lock-icon-color' />}
                </div>
            }
        </div>
    )
}

export default DropdownItem
