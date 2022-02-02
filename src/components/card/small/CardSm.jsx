import React from 'react'
import './CardSm.scss'
import RealtimeSpectrometer from './../../../assets/component/RealtimeSpectrometer';
import ImageAnalyzer from './../../../assets/component/ImageAnalyzer';

const Type = [
    'spectrometer',
    'analyzer'
];

function CardSm({ type }) {
    return (
        <div className='card-sm'>
            <div className='card-sm-top'>
                {type === Type[0] ?
                    <RealtimeSpectrometer className='card-sm-icon card-sm-icon-flip'/>
                    :
                    <ImageAnalyzer className='card-sm-icon card-sm-icon-rotate'/>
                }
            </div>
            <div className='card-sm-bottom'>
                {type === Type[0] ? 'Realtime Spectrometer' : 'Image Analyzer'}
            </div>
        </div>
    )
}

export default CardSm
