import React from 'react'
import './LoginAccount.scss'
import Header from './../../../components/header/Header';
import CardMdAccount from './../../../components/card/medium/account/CardMdAccount';

function LoginAccount() {
    return (
        <div className='login-account'>
            <Header hideProfile={true} />
            <CardMdAccount />
        </div>
    )
}

export default LoginAccount
