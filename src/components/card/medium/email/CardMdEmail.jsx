import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../button/button/Button'
import InputEmail from '../../../input/email/InputEmail'
import InputPassword from '../../../input/password/InputPassword'
import './CardMdEmail.scss'

function CardMdEmail() {
    return (
        <div className='card-md-email'>
            <div className='card-md-email-header'>Login</div>
            <div className='card-md-email-section'>
                <InputEmail />
                <InputPassword />
                <Button title='Login' />
            </div>
            <div className='card-md-email-footer'>
                <Link to='/login-account' style={{ textDecoration: 'none' }}>
                    <div className='card-md-email-footer-content'>Another method</div>
                </Link>
                <Link to='/signup' style={{ textDecoration: 'none' }}>
                    <div className='card-md-email-footer-content'>Signup</div>
                </Link>
            </div>
        </div>
    )
}

export default CardMdEmail
