import React from 'react'
import ReactDom from 'react-dom'
import { useState } from 'react'
import axios from 'axios'
import './modal.css'
import SuccessNotification from './successNotification'
import { Navigate, useNavigate } from "react-router-dom";

const URL = process.env.REACT_APP_BASE_URL;

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
    const navigate = useNavigate();

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
            console.log(data)
            handleSuccess();
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'there was an error' });
        }
    };

    if (!open) {return null;}
    
    return ReactDom.createPortal(
        <>
        <div style={overlay_style} onClick={handleClose}/>
            <div onClick={(e) => e.stopPropagation()} style={modal_styles} >
            <button style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer', padding:"5px 10px",}} onClick={handleClose}>×</button>
            <div className='login-container'>
                <form style={s} className="login-form" id="lost-item-form" onSubmit={handleLogin}>

                    <h1 style={{textAlign:'center', marginTop:'-5%'}}>Sign in</h1>

                    <label htmlFor="userName">Username:</label>
                    <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} required/>

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/>



                    {alert.show &&  (
                    <p className={`loginAlert alert-${alert.type}`}>{alert.text}</p>
                    )}
                    <div style={{ textAlign:'center'}}>
                    <button type="submit" style={{ width: '50%' }}>Log in</button>
                    </div>
                    
                    
                </form>
            </div>
        </div>
        {success && <SuccessNotification message={successMessage} />}
        </>,
        document.getElementById('portal')
    )
}