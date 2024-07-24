import React from 'react'
import ReactDom from 'react-dom'
import { useState } from 'react'
import axios from 'axios'
import './modal.css'
import SuccessNotification from './successNotification'
import CloseIcon from '@mui/icons-material/Close';
import {LoadingButton} from '@mui/lab';


const modal_styles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'pink',
    padding: '30px 50px',
    zIndex: 1000,
    maxHeight: '85vh',
    width: '20%',
    maxWidth: '500px',
    overflowY: 'auto',
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.75)",
}

const overlay_style = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1000
}

const s = {
    backgroundColor: "pink",
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    // boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
}

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
            const { data } = await axios.post('/api/v1/admin/register', newAdmin);
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
            await axios.post('/api/v1/admin/verification', {userName, verificationCode})
            setLoading(false);
            handleSuccess();
        } catch (error) {
            const { msg } = error.response.data;
            console.log(error);
            showAlert({ text: msg || 'There was an error' });
            setLoading(false);
        }
    }

    console.log(alert.type)
    console.log(alert.type === 'success')
    if (!open) {return null;}
    
    return ReactDom.createPortal(
        <>
        <div style={overlay_style}/>
            <div style={modal_styles} >
            <CloseIcon style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer', padding:"5px 10px",}} onClick={handleClose}></CloseIcon>
            <div className='login-container'>
                {registerationStep === 1 ? (
                    <form style={s} className="login-form" id="lost-item-form" onSubmit={handleRegister}>

                        <h1 style={{textAlign:'center', marginTop:'-5%'}}>Admin Registeration</h1>

                        <label htmlFor="userName">Username:</label>
                        <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} required/>

                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/>

                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>



                        {alert.show && (alert.type === 'success') ? (
                            <p className={`verificationAlert alert-${alert.type}`} style={{ color: 'green', marginTop: '5px' }}>{alert.text}</p>
                        )
                        :
                        (
                            <p className={`verificationAlert alert-${alert.type}`} style={{ color: 'green', marginTop: '5px' }}>{alert.text}</p>
                        )
                        }
                        <div style={{ textAlign:'center'}}>
                        <button type="submit" style={{ width: '50%' }}>Register</button>
                        </div>
                        
                        
                    </form>

                )
                :
                (
                    <form style={s} className="login-form" id="lost-item-form" onSubmit={handleVerification}>

                        <h1 style={{textAlign:'center', marginTop:'-5%'}}>Verify your email</h1>

                        <label htmlFor="verificationCode">Verification Code:</label>
                        <input type="text" id="verificationCode" name="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required/>

                        {alert.show && (alert.type === 'success') ? (
                            <p className={`verificationAlert alert-${alert.type}`} style={{ color: 'green', marginTop: '5px' }}>{alert.text}</p>
                        )
                        :
                        (
                            <p className={`verificationAlert alert-${alert.type}`} style={{ color: 'red', marginTop: '5px' }}>{alert.text}</p>
                        )
                        }
                        <div style={{ textAlign:'center', color:'pink'}}>
                        {/* <button type="submit" style={{ width: '50%' }}>Verify Code</button> */}
                            <div className='loadingButton'>
                                <LoadingButton
                                type='submit'
                                onClick={handleVerification}
                                loading={loading}
                                loadingIndicator="Verifying…"
                                variant="outlined"
                                sx={{ color: 'blue', borderColor:'hotpink'}}
                                >
                                <span>Verify Code</span>
                                </LoadingButton>

                        </div>
                        </div>
                        
                        
                    </form>
                )}
            </div>
        </div>
        {success && <SuccessNotification message={successMessage} />}
        </>,
        document.getElementById('portal')
    )
}