import React from 'react'
import './DropdownMenu.scss'
import DropdownItem from '../item/DropdownItem';

function DropdownMenu({ className, shown, setShown, onItemSelected, itemList, iconList, disabled, tooltip, iconProp, light}) {

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const onSelected = (index) => {
        if (onItemSelected) onItemSelected(index);
        if (setShown) setShown(!shown);
    }

    return (
        <>
            {itemList ?
                <div className={`dropdown-menu ${itemList.length > 6 ? '' : 'dropdown-menu-no-scroll'} ${className}`} style={{ height: shown ? ((itemList.length * 31) - 1) + 'px' : 0 }}>
                    {itemList.map((data, index) => (
                        <DropdownItem key={index} index={index} icon={iconList[data.iconIndex]} iconProp={iconProp ? iconProp[index] : undefined} title={data.title} disabled={disabled && disabled[index]} tooltip={tooltip ? tooltip[index] : undefined} showTooltip={data.tooltip} onClick={onClick} onSelected={onSelected} secured={data.secured} light={light} />
                    ))}
                </div>
                :
                <div></div>
            }
        </>
    )
}

export default DropdownMenu
