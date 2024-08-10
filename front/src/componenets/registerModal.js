import React from 'react'
import ReactDom from 'react-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import SuccessNotification from './successNotification'
import CloseIcon from '@mui/icons-material/Close';
import {LoadingButton} from '@mui/lab';
import InputRow from '../utils/inputRow'
import '../index.css'
import VerificationModal from './verificationModal'

const URL = process.env.REACT_APP_BASE_URL;

export default function Modal ({ open, children, onClose}) {
    const [registerationStep, setRegisterationStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        text: '',
        type: 'danger',
    });
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const showAlert = ({ text, type = 'danger' }) => {
        setAlert({ show: true, text, type });
    };
    const hideAlert = () => {
        setAlert({ show: false, text: '', type: 'danger' });
    };

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
    });

    useEffect(() => {
        if (open) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }

        return () => {
          document.body.style.overflow = '';
        };
      }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(
            prev => ({
                ...prev,
                [name]: value
            })
        )
    };

    const handleSuccess = () => {
        setSuccess(true);
        setSuccessMessage('Registered successfully')
        setFormData({
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
        });
        setTimeout(() => {
            onClose();
            setSuccess(false);
            setSuccessMessage('');
            setVerificationCode('')
            setRegisterationStep(1);
        }, 2000);
        

    };

    const handleClose = () => {
        onClose();
        hideAlert();
        setFormData({
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
        });
        setVerificationCode('')
    }



    const handleRegister = async (e) => {
        e.preventDefault();
        hideAlert();
        const { userName, password, confirmPassword, email} = formData;
        if (password !== confirmPassword) {
            showAlert({ text: 'Passwords do not match' });
            return
        }

        const newAdmin = { userName, password, email};

        try {
            const { data } = await axios.post(`/api/v1/admin/register`, newAdmin);
            showAlert({ text: data.msg, type: 'success' });
            setRegisterationStep(2);
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'there was an error' });
        }
    };

    const handleVerification = async (e) => {
        setLoading(true);
        e.preventDefault();
        hideAlert();
        if (!verificationCode) {
            return;
        }
    
        try {
            const {userName} = formData
            await axios.post(`/api/v1/admin/verification`, {userName, verificationCode})
            setLoading(false);
            handleSuccess();
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'There was an error' });
            setLoading(false);
        }
    }

    const handleVerificationCode = (e) => {
        setVerificationCode(e.target.value)
    }


    if (!open) {return null;}
    
    return ReactDom.createPortal(
        <>
        <div className='model-overlay_style'/>
            <div className='modal' >
            <CloseIcon style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer', padding:"5px 10px",}} onClick={handleClose}></CloseIcon>
            <div>
                {registerationStep === 1 ? (
                    <form className="form modal-form" onSubmit={handleRegister}>

                        <h1 style={{textAlign:'center', marginTop:'-5%'}}>Admin Registeration</h1>

                        <InputRow
                            type='text'
                            label="username"
                            name='userName'
                            value={formData.userName}
                            handleChange={handleChange}
                        />
                        <InputRow
                            type='password'
                            label="password"
                            name='password'
                            value={formData.password}
                            handleChange={handleChange}
                        />
                        <InputRow
                            type='password'
                            label="confirm password"
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            handleChange={handleChange}
                        />
                        <InputRow
                            type='email'
                            label="email"
                            name='email'
                            value={formData.email}
                            handleChange={handleChange}
                        />



                        {alert.show &&(
                            <p className={`Alert alert-${alert.type}`} >{alert.text}</p>
                        )
                        }
                        <div style={{ textAlign:'center'}}>
                        <button type="submit" style={{ width: '50%' }}>Register</button>
                        </div>
                        
                        
                    </form>

                )
                :
                (
                    <VerificationModal
                        handleVerification={handleVerification}
                        verificationCode={verificationCode}
                        InputRow={InputRow}
                        alert={alert}
                        LoadingButton={LoadingButton}
                        loading={loading}
                        handleVerificationCode={handleVerificationCode}
                    />
                )}
            </div>
        </div>
        {success && <SuccessNotification message={successMessage} />}
        </>,
        document.getElementById('portal')
    )
}