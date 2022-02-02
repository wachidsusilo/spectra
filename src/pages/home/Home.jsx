import React from 'react'
import './Home.scss'
import CardSm from '../../components/card/small/CardSm'
import Header from '../../components/header/Header'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className='home'>
            <Header />
            <div className='home-section'>
                <Link to='/realtime-spectrometer' style={{textDecoration: 'none'}}>
                    <CardSm type='spectrometer' />
                </Link>
                <Link to='image-analyzer' style={{textDecoration: 'none'}}>
                    <CardSm type='analyzer' />
                </Link>
            </div>
        </div>
    )
}

export default Home
