import React, { useEffect, useRef } from 'react'
import CardLgSpectrometerHeader from '../header/CardLgSpectrometerHeader';
import './CardLgSpectrometer.scss'
import ChartSpectrometer from './../../../../chart/spectrometer/ChartSpectrometer';

function CardLgSpectrometer({ loadRef, bodyRef, openRef, idRef, drawRef, spFillRef, spChartPosRef, headRef, onSave, onDownload }) {
    const ref = useRef();

    useEffect(() => {
        const element = ref.current;
        if (element) document.documentElement.style.setProperty('--card-lg-spectrometer-width', element.clientWidth + 'px');
        const onResize = () => {
            if (element) document.documentElement.style.setProperty('--card-lg-spectrometer-width', element.clientWidth + 'px');
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return (
        <div ref={ref} className='card-lg-spectrometer'>
            <CardLgSpectrometerHeader loadRef={loadRef} bodyRef={bodyRef} openRef={openRef} idRef={idRef} fillRef={spFillRef} headRef={headRef} drawRef={drawRef} onSave={onSave} onDownload={onDownload} />
            <div className='card-lg-spectrometer-section'>
                <div ref={loadRef} className='card-lg-spectrometer-loader'></div>
                <ChartSpectrometer type='spectrometer' fillRef={spFillRef} chartPosRef={spChartPosRef} drawRef={drawRef} bodyRef={bodyRef} />
            </div>
        </div>
    )
}

export default CardLgSpectrometer
