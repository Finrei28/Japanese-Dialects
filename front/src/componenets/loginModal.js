import React from 'react'
import ReactDom from 'react-dom'
import { useState } from 'react'
import axios from 'axios'
import SuccessNotification from './successNotification'
import { Navigate, useNavigate, Link } from "react-router-dom";
import '../index.css';
import InputRow from '../utils/inputRow'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const URL = process.env.REACT_APP_BASE_URL;

const modal_styles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'pink',
    padding: '30px 30px',
    zIndex: 1000,
    maxHeight: '85vh',
    width: '20%',
    maxWidth: '500px',
    overflowY: 'auto',
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.75)",
    borderRadius: "20px",
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
    backgroundColor: "white",
    maxWidth: "600px",
    margin: "20px auto",
    padding: "50px 10px",
    // boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    
}

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

    const handleClose = () => {
        onClose();
        setFormData({
            userName: '',
            password: '',
        });
        hideAlert();
    }



    const handleLogin = async (e) => {
        e.preventDefault();
        hideAlert();
        const { userName, password} = formData;
        const user = { userName, password};

        try {
            const { data } = await axios.post(`/api/v1/admin/login`, user);
            if (data.msg === 'notVerified') {
                setVerified(false);
                return;
            }
            handleSuccess();
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'there was an error' });
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
            showAlert({ text: msg || 'there was an error' });
        }
    }

    const handleForgotState = async () => {
        setforgotState(false)
    }

    if (!open) {return null;}
    
    return ReactDom.createPortal(
        <>
        <div style={overlay_style} onClick={handleClose}/>
            <div onClick={(e) => e.stopPropagation()} style={modal_styles} >
            <button style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer', padding:"5px 10px",}} onClick={handleClose}>×</button>
            <div className='login-container'>
                {!forgotState ? (

                <form style={s} className="form" onSubmit={handleLogin}>

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
                    <form style={s} className="form" onSubmit={handleForgotPassword}>
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
                }
            </div>
        </div>
        {success && <SuccessNotification message={successMessage} />}
        </>,
        document.getElementById('portal')
    )
}