import React from 'react'
import './InputEmail.scss'
import Email from './../../../assets/component/Email';

function InputEmail({ onChange }) {
    return (
        <div className='input-email'>
            <div className='input-email-title'>Email</div>
            <div className='input-email-container'>
                <div className='input-email-rect'>
                    <Email className='input-email-icon' />
                </div>
                <label htmlFor='email'></label>
                <input className='input-email-edit' id='email' type="email" onChange={onChange} />
            </div>
        </div>
    )
}

export default InputEmail
