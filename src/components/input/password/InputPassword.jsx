import React, { useState } from 'react'
import './InputPassword.scss'
import Key from './../../../assets/component/Key';
import NoEye from './../../../assets/component/NoEye';
import Eye from './../../../assets/component/Eye';

function InputPassword({confirmation, onChange}) {
    const [sight, setSight] = useState(false);

    const onSightChange = () => {
        setSight(!sight);
    }

    return (
        <div>
            <div className='input-password'>
                <div className='input-password-title'>{confirmation ? 'Confirm Password' : 'Password'}</div>
                <div className='input-password-container'>
                    <div className='input-password-rect-icon'>
                        <Key className='input-password-icon' />
                    </div>
                    <label htmlFor='password'></label>
                    <input className='input-password-edit' type={sight ? 'text' : 'password'} onChange={onChange} />
                    <div className='input-password-container-sight'>
                        {sight ?
                            <Eye className='input-password-sight-small' colorClass='input-password-sight-color' onClick={onSightChange} />
                            :
                            <NoEye className='input-password-sight' colorClass='input-password-sight-color' onClick={onSightChange} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InputPassword
