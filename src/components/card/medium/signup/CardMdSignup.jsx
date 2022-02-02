import React from 'react'
import './CardMdSignup.scss'
import InputEmail from './../../../input/email/InputEmail';
import InputPassword from './../../../input/password/InputPassword';
import Button from './../../../button/button/Button';
import { Link } from 'react-router-dom';

function CardMdSignup() {
    return (
        <div className='card-md-signup'>
            <div className='card-md-signup-header'>Signup</div>
            <div className='card-md-signup-section'>
                <InputEmail />
                <InputPassword />
                <InputPassword confirmation={true}/>
                <Button title='Signup' />
            </div>
            <div className='card-md-signup-footer'>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                    <div className='card-md-signup-footer-content'>Already have an account?</div>
                </Link>
            </div>
        </div>
    )
}

export default CardMdSignup
