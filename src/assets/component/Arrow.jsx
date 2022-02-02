import React, { forwardRef } from 'react'

const Arrow = forwardRef(({ className, onClick, filter }, ref) => {
    return (
        <svg className={className} width="67" height="50" viewBox="0 0 67 50" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <g ref={ref} filter={filter || 'url(#filter_arrow)'} style={{ transition: 'all 0.3 ease-in-out' }}>
                <path d="M66.5529 24.9147L33.2765 0V13.8225H0V36.1775H33.2765V50L66.5529 24.9147Z" fill="url(#paint0_linear)" fillOpacity="0.6" />
                <path d="M33.2765 14.3225H33.7765V13.8225V0.998974L65.7205 24.916L33.7765 48.9969V36.1775V35.6775H33.2765H0.5V14.3225H33.2765Z" stroke="url(#paint1_linear)" strokeOpacity="0.6" />
            </g>
            <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="71.2105" y2="42.1268" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.8" />
                    <stop offset="1" stopColor="white" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="0" y1="0" x2="71.2105" y2="42.1268" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
            <defs>
                <filter id="filter_arrow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                    <feOffset dx="1" dy="3" result="offsetblur" />
                    <feFlood floodColor="rgba(0,0,0,0.3)" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <defs>
                <filter id="filter_arrow_inverted">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" />
                    <feOffset dx="-1" dy="3" result="offsetblur" />
                    <feFlood floodColor="rgba(0,0,0,0.3)" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    )
})

export default Arrow
