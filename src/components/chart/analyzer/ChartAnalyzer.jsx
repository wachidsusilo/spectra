import React, { useEffect, useRef, useState } from 'react'
import './ChartAnalyzer.scss'
import Chart from 'chart.js/auto';
import { getDataset } from '../../../variables/data';

function ChartAnalyzer({ type, fillRef, chartPosRef, drawRef, bodyRef, rgbRef }) {
    const [state, setState] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const ctx = ref.current.getContext('2d');
        const lastPosition = { x: 0 }
        const chart = new Chart(ctx, {
            type: 'line',
            data: getDataset(rgbRef),
            options: {
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        titleColor: '#ffd600',
                        bodyColor: '#ffd54f',
                        boxWidth: 12,
                        boxHeight: 12
                    },
                    legend: {
                        display: false
                    },
                },
                elements: {
                    line: {
                        borderWidth: 2,
                        fill: fillRef.current,
                        tension: 1,
                    },
                    point: {
                        pointRadius: 0,
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                    axis: 'x'
                },
                events: ['click'],
                animation: {
                    duration: 0,
                    onComplete: (e) => {
                        if (e.chart.tooltip._active && e.chart.tooltip._active.length) {
                            if (lastPosition.x !== e.chart.tooltip._eventPosition.x) {
                                lastPosition.x = e.chart.tooltip._eventPosition.x;
                                chartPosRef.current = { x: e.chart.tooltip._eventPosition.x, y: e.chart.tooltip._eventPosition.y }
                                const ctx = e.chart.ctx,
                                    x = e.chart.tooltip._eventPosition.x,
                                    topY = e.chart.chartArea.top,
                                    bottomY = e.chart.chartArea.bottom;
                                ctx.save();
                                ctx.beginPath();
                                ctx.setLineDash([3, 3]);
                                ctx.moveTo(x, topY);
                                ctx.lineTo(x, bottomY);
                                ctx.lineWidth = 2;
                                ctx.strokeStyle = '#23232380';
                                ctx.stroke();
                                ctx.restore();
                            }
                        } else {
                            lastPosition.x = 0;
                            if(chartPosRef) chartPosRef.current = undefined;
                        }
                    }
                },
                transitions: false,
                animations: false
            }
        });

        if (chartPosRef.current) {
            const rect = chart.canvas.getBoundingClientRect();
            chart.canvas.dispatchEvent(new MouseEvent('click', {
                clientX: rect.left + chartPosRef.current.x,
                clientY: rect.top + chartPosRef.current.y
            }));
        }

        const onHideTooltip = () => {
            const rect = chart.canvas.getBoundingClientRect();
            chart.canvas.dispatchEvent(new MouseEvent('click', {
                clientX: rect.left,
                clientY: rect.top
            }));
        }

        const body = bodyRef ? bodyRef.current : undefined;
        if(body) body.addEventListener('click', onHideTooltip);

        if (drawRef) drawRef.current = () => {
            setState(!state);
        }

        return () => {
            chart.destroy();
            if(body) body.removeEventListener('click', onHideTooltip);
        }
    }, [chartPosRef, drawRef, state, ref, fillRef, type, bodyRef, rgbRef])

    return (
        <div className='chart-analyzer'>
            <canvas ref={ref} />
        </div>
    )
}

export default ChartAnalyzer
