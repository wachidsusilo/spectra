import React, { useEffect, useState } from 'react'
import './NavContent.scss'
import { Link } from 'react-router-dom';
import LogoThin from '../../../assets/component/LogoThin';
import Logout from '../../../assets/component/Logout';
import Profile from '../../../assets/component/Profile';
import History from '../../history/History';
import Avatar from '../../avatar/Avatar';
import Delete from '../../../assets/component/Delete';
import SpectrometerMono from '../../../assets/component/SpectrometerMono';
import AnalyzerMono from '../../../assets/component/AnalyzerMono';
import { getUsername, getProfilePicture, setProfile } from './../../../variables/profile';
import { ACTION_TYPE } from '../../../constants/constant';
import { HISTORY_TYPE } from './../../../constants/constant';
import { getSpectrometerHistory, getAnalyzerHistory } from './../../../variables/history';
import { auth } from '../../../firebase/firebase';

function NavContent({ action, historyType, bodyRef, showNav, setShowNav, navRef, onOpen, onDelete }) {
    const [state, setState] = useState();
    const history = historyType === HISTORY_TYPE[0] ? getSpectrometerHistory() : getAnalyzerHistory();
    
    useEffect(() => {
        if(navRef) navRef.current = () => {
            setState(!state);
        }
        const body = bodyRef.current;
        const onClick = () => {
            if (showNav) setShowNav(!showNav);
        }
        body.addEventListener('click', onClick);
        body.style.zIndex = showNav ? 90 : 0;
        return () => {
            body.removeEventListener('click', onClick);
            if(navRef) navRef.current = undefined;
        }
    }, [bodyRef, showNav, setShowNav, navRef, state])

    const onClickNav = (e) => {
        e.stopPropagation();
    }

    const onClickLogout = () => {
        auth.signOut().then(() => {
            setProfile(null, null, null);
            setState(!state);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className={`nav ${showNav ? 'nav-show' : 'nav-hide'}`} onClick={onClickNav}>
            <div className='nav-header'>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <LogoThin className='nav-logo' colorClass='nav-logo-color' />
                </Link>
                <div className={`nav-header-action ${action !== ACTION_TYPE[3] ? '' : 'hide'}`}>
                    <Link className={action !== ACTION_TYPE[2] ? '' : 'hide'} to='/realtime-spectrometer' style={{ textDecoration: 'none' }}>
                        <SpectrometerMono className='nav-header-action-icon' colorClass='nav-header-action-icon-color' title='Realtime Spectrometer' />
                    </Link>
                    <Link className={action !== ACTION_TYPE[1] ? '' : 'hide'} to='/image-analyzer' style={{ textDecoration: 'none' }}>
                        <AnalyzerMono className='nav-header-action-icon' colorClass='nav-header-action-icon-color' title='Image Analyzer' />
                    </Link>
                </div>
            </div>
            <div className='nav-profile'>
                <Delete className='nav-profile-close' colorClass='nav-profile-close-color' onClick={() => setShowNav(!showNav)} />
                {getProfilePicture() ?
                    <img className='nav-profile-picture nav-profile-picture-border' alt='' src={getProfilePicture()} />
                    : getUsername() ?
                        <Avatar className='nav-profile-picture nav-profile-picture-border' username={getUsername()} />
                        :
                        <Profile className='nav-profile-picture' />
                }
                <p className='nav-profile-name'>{getUsername() || 'Guest'}</p>
            </div>
            <div className={`nav-history ${getUsername() || 'hide'}`}>
                <div className='nav-history-header'>History</div>
                <div className='nav-history-container'>
                    <div className='nav-history-section'>
                        {history && history.map((item, index) => <History key={index} uid={item.id} title={item.title} description={item.description} date={item.date + ' ' + item.time} onOpen={onOpen} onDelete={onDelete} />)}
                    </div>
                </div>
            </div>
            <div className='nav-logout'>
                <Logout className='nav-logout-picture' />
                {getUsername() ?
                    <p className='nav-logout-name' onClick={onClickLogout}>Logout</p>
                    :
                    <Link to='/login-account' style={{ textDecoration: 'none' }}>
                        <p className='nav-logout-name'>Login</p>
                    </Link>
                }
            </div>
        </div>
    )
}

export default NavContent;
