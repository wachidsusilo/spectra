import React, { useRef } from 'react'
import './History.scss'
import Delete from './../../assets/component/Delete';
import Open from './../../assets/component/Open';

function History({ uid, title, date, description, onDelete, onOpen }) {
    const ref = useRef();
    const tooltipRef = useRef(document.createElement('div'));

    const onClickOpen = () => {
        if(onOpen) onOpen(uid);
    }

    const onClickDelete = () => {
        if(onDelete) onDelete(uid);
    }

    const onTouchStart = (e) => {
        tooltipRef.current.innerHTML = description;
        tooltipRef.current.classList.add('history-tooltip');
        ref.current.appendChild(tooltipRef.current);
    }

    const onTouchEnd = (e) => {
        ref.current.removeChild(tooltipRef.current);
    }

    return (
        <div ref={ref} className='history' title={description} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className='history-props'>
                <p className='history-title'>{title}</p>
                <p className='history-date'>{date}</p>
            </div>
            <div className='history-action'>
                <Open className='history-action-icon' colorClass='history-action-icon-color' title='Open' onClick={onClickOpen} />
                <Delete className='history-action-icon' colorClass='history-action-icon-color' title='Delete' onClick={onClickDelete} />
            </div>
        </div>
    )
}

export default History
