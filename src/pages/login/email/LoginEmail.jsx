import React from 'react'
import './LoginEmail.scss'
import Header from './../../../components/header/Header';
import CardMdEmail from '../../../components/card/medium/email/CardMdEmail';

function LoginEmail() {
    return (
        <div className='login-email'>
            <Header hideProfile={true} />
            <CardMdEmail />
        </div>
    )
}

export default LoginEmail
