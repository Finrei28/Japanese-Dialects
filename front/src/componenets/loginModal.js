import React from 'react'
import ReactDom from 'react-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import SuccessNotification from './successNotification'
import { useNavigate, Link } from "react-router-dom";
import '../index.css';
import InputRow from '../utils/inputRow'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerificationModal from './verificationModal'
import {LoadingButton} from '@mui/lab';

const URL = process.env.REACT_APP_BASE_URL;

export default function Modal ({ open, children, onClose}) {
    const navigate = useNavigate();

    const [alert, setAlert] = useState({
        show: false,
        text: '',
        type: 'danger',
    });
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [forgotState, setforgotState] = useState(false);
    const [email, setEmail] = useState('');
    const [verified, setVerified] = useState(true);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const showAlert = ({ text, type = 'danger' }) => {
        setAlert({ show: true, text, type });
    };
    const hideAlert = () => {
        setAlert({ show: false, text: '', type: 'danger' });
    };

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
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
        setSuccessMessage('Logged in successfully redirecting...')
        setFormData({
            userName: '',
            password: '',
        });
        setTimeout(() => {
            onClose();
            setSuccess(false);
            navigate("/dashboard")
        }, 1500);

    };

    const handleVerificationSuccess = () => {
        setSuccess(true);
        setSuccessMessage('Email Verified Successfully \n Please Log in')
        setVerificationCode('');
        setFormData({
            userName: '',
            password: '',
        });
        setTimeout(() => {
            onClose();
            setSuccess(false);
            navigate("/");
            setVerified(true);
        }, 2000);
    }

    const handleClose = () => {
        onClose();
        setFormData({
            userName: '',
            password: '',
        });
        setforgotState(false);
        hideAlert();
    }



    const handleLogin = async (e) => {
        e.preventDefault();
        hideAlert();
        const { userName, password } = formData;
        const user = { userName, password};

        try {
            await axios.post(`/api/v1/admin/login`, user);
            handleSuccess();
        } catch (error) {
            const { msg } = error.response.data;
            if (msg === 'notVerified') {
                await axios.post(`/api/v1/admin/resendVerificationCode`, { userName })
                setVerified(false);
                return;
            }
            showAlert({ text: msg || 'Please try again later' });
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/api/v1/admin/forgotPassword`, {email})
            setEmail('');
            showAlert({ text: data.msg, type: 'success' })
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'Please try again later' });
        }
    }

    const handleForgotState = async () => {
        setforgotState(false)
    }

    const handleVerification = async (e) => {
        setLoading(true);
        e.preventDefault();
        hideAlert();
        try {
            const {userName} = formData
            await axios.post(`/api/v1/admin/verification`, {userName, verificationCode})
            setLoading(false);
            handleVerificationSuccess();
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'Please try again later' });
            setLoading(false);
        }
    }

    const handleVerificationCode = (e) => {
        setVerificationCode(e.target.value)
    }

    if (!open) {return null;}
    
    return ReactDom.createPortal(
        <>
        <div className='model-overlay_style' onClick={handleClose}/>
            <div className='modal' onClick={(e) => e.stopPropagation()} >
            <button style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer', padding:"5px 10px",}} onClick={handleClose}>×</button>
            <div>
                {forgotState ?
                (
                    <form className="form modal-form" onSubmit={handleForgotPassword}>
                    <ArrowBackIcon style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '20px', cursor: 'pointer', padding:"5px 10px", color:"white"}} onClick={handleForgotState}></ArrowBackIcon>
                    <h2 style={{textAlign:'center', marginTop:'-5%'}}>Reset Password</h2>
                    <InputRow
                        type='email'
                        label="email"
                        name='email'
                        value={email}
                        handleChange={e => setEmail(e.target.value)}
                    />

                    {alert.show &&  (
                    <p className={`loginAlert alert-${alert.type}`}>{alert.text}</p>
                    )}
                    <div style={{ textAlign:'center'}}>
                    <button type="submit" style={{ width: '50%' }}>Send Email</button>
                    </div>
                    
                    
                </form>
                )
                : verified ?
                (

                    <form className="form modal-form" onSubmit={handleLogin}>
    
                        <h2 style={{textAlign:'center', marginTop:'-5%'}}>Sign in</h2>
                        <InputRow
                            type='text'
                            label="username"
                            name='userName'
                            value={formData.userName}
                            handleChange={handleChange}
                        />
                        <InputRow
                            type='password'
                            label='password'
                            name='password'
                            value={formData.password}
                            handleChange={handleChange}
                        />
    
                        {alert.show &&  (
                        <p className={`loginAlert alert-${alert.type}`}>{alert.text}</p>
                        )}
                        <div style={{ textAlign:'center'}}>
                        <button type="submit" style={{ width: '50%' }}>Log in</button>
                        <p>
                            
                            <Link onClick={() => setforgotState(true)} className='reset-link'>
                            Forgot your password?
                            </Link>
                        </p>
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
                    )
                }
            </div>
        </div>
        {success && <SuccessNotification message={successMessage} />}
        </>,
        document.getElementById('portal')
    )
}