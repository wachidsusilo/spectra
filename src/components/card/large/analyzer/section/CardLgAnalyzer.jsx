import React, { useEffect, useRef, useState } from 'react'
import CardLgAnalyzerHeader from '../header/CardLgAnalyzerHeader';
import './CardLgAnalyzer.scss'
import ChartAnalyzer from './../../../../chart/analyzer/ChartAnalyzer';

function CardLgAnalyzer({ fillRef, anChartPosRef, drawRef, actionRef, anRef, chartLoadRef, onSave, onDownload, bodyRef, rgbRef }) {
    const [state, setState] = useState();
    const ref = useRef();

    useEffect(() => {
        if(anRef) anRef.current = () => {
            setState(!state);
        }
        const element = ref.current;
        if (element) document.documentElement.style.setProperty('--card-lg-analyzer-width', element.clientWidth + 'px');
        const onResize = () => {
            if (element) document.documentElement.style.setProperty('--card-lg-analyzer-width', element.clientWidth + 'px');
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, [anRef, state]);

    const onFill = () => {
        fillRef.current = !fillRef.current;
        drawRef.current();
        actionRef.current();
    }

    return (
        <div ref={ref} className='card-lg-analyzer'>
            <CardLgAnalyzerHeader fillRef={fillRef} onDownload={onDownload} onSave={onSave} onFill={onFill} actionRef={actionRef} bodyRef={bodyRef} rgbRef={rgbRef} drawRef={drawRef} />
            <div className='card-lg-analyzer-section'>
                <div ref={chartLoadRef} className='card-lg-analyzer-loader'></div>
                <ChartAnalyzer type='analyzer' fillRef={fillRef} chartPosRef={anChartPosRef} drawRef={drawRef} bodyRef={bodyRef} rgbRef={rgbRef} />
            </div>
        </div>
    )
}

export default CardLgAnalyzer
