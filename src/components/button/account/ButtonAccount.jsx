import React from 'react'
import './ButtonAccount.scss'
import Google from './../../../assets/component/Google';
import Facebook from './../../../assets/component/Facebook';
import Twitter from './../../../assets/component/Twitter';
import Microsoft from './../../../assets/component/Microsoft';
import Github from './../../../assets/component/Github';

const Type = [
    'google',
    'facebook',
    'twitter',
    'microsoft',
    'github'
];

const getIcon = (type) => {
    switch (type) {
        case Type[0]:
            return <Google className='button-account-icon' />
        case Type[1]:
            return <Facebook className='button-account-icon' />
        case Type[2]:
            return <Twitter className='button-account-icon' />
        case Type[3]:
            return <Microsoft className='button-account-icon' />
        default:
            return <Github className='button-account-icon' />
    }
}

function ButtonAccount({ type, onClick }) {
    return (
        <div className='button-account' onClick={onClick}>
            <div className='button-account-rect'>
                {getIcon(type)}
            </div>
            <div className='button-account-description'>{`Login with ${type.charAt(0).toUpperCase() + type.substring(1)} account`}</div>
        </div>
    )
}

export default ButtonAccount
