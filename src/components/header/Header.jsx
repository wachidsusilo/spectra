import React, { useEffect, useState } from 'react'
import './Header.scss'
import Profile from './../../assets/component/Profile';
import Logo from './../../assets/component/Logo';
import Avatar from './../avatar/Avatar';
import SpectrometerMono from './../../assets/component/SpectrometerMono';
import AnalyzerMono from './../../assets/component/AnalyzerMono';
import { Link } from 'react-router-dom';
import { getUsername, getProfilePicture } from './../../variables/profile';
import { auth } from './../../firebase/firebase';

const Shown = [
    'all',
    'spectrometer',
    'analyzer',
    'hide'
];

function Header({ className, hideProfile, shown }) {
    const [state, setState] = useState(false);

    useEffect(() => {
        if (!hideProfile) {
            const unsubscribe = auth.onAuthStateChanged(() => {
                setState(!state);
            });
            return unsubscribe;
        }
    }, [state, hideProfile]);

    return (
        <div className={`header ${className}`} onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
            <div className='header-rect'>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Logo className='header-logo' colorClass='header-logo-color' />
                </Link>
                <div className={`header-profile ${hideProfile ? 'hide' : ''}`}>
                    <>{getUsername() ?
                        <p className='header-profile-name'>{getUsername()}</p>
                        :
                        <Link to='/login-account' style={{ textDecoration: 'none' }}>
                            <p className='header-profile-name'>Login</p>
                        </Link>
                    }</>
                    {getProfilePicture() ?
                        <img className='header-profile-picture header-profile-picture-border' alt='' src={getProfilePicture()} />
                        : getUsername() ?
                            <Avatar className='header-profile-picture header-profile-picture-border' username={getUsername()} />
                            :
                            <Profile className='header-profile-picture' />
                    }
                </div>
                <div className={`header-action ${hideProfile && shown !== Shown[3] ? '' : 'hide'}`}>
                    <Link className={shown !== Shown[2] ? '' : 'hide'} to='/realtime-spectrometer' style={{ textDecoration: 'none' }}>
                        <SpectrometerMono className='header-action-icon' colorClass='header-action-icon-color' title='Realtime Spectrometer' />
                    </Link>
                    <Link className={shown !== Shown[1] ? '' : 'hide'} to='/image-analyzer' style={{ textDecoration: 'none' }}>
                        <AnalyzerMono className='header-action-icon' colorClass='header-action-icon-color' title='Image Analyzer' />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header
