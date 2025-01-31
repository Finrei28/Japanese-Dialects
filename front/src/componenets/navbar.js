import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import '../index.css'
import Modal from './loginModal';
import AddIcon from '@mui/icons-material/Add';


export default function Navbar() {
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const [admin, setAdmin] = useState('')
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setAdmin(token);
        } else {
            setAdmin('');
        }
    }, []); 
    const handleOpenModel = () => {
        setOpenModal(true);
    }

    const handleCloseModel = () => {
        setOpenModal(false);
    }

   
    return (
        <div className='navbar'>
            <div className='loginButton'>
                { admin === '' ? <button className='login-button' onClick={handleOpenModel}>Sign in</button> : <AddIcon fontSize='large' className='adminPage' onClick={() => navigate("/dashboard")}>Add something new</AddIcon>}
                <Modal open={openModal} onClose={handleCloseModel}> </Modal>
            </div>
        </div>
    )
}