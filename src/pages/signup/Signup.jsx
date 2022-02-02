import React from 'react'
import './Signup.scss'
import Header from '../../components/header/Header'
import CardMdSignup from './../../components/card/medium/signup/CardMdSignup';

function Signup() {
    return (
        <div className='signup'>
            <Header hideProfile={true} />
            <CardMdSignup />
        </div>
    )
}

export default Signup
