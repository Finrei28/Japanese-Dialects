import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import './navbar.css';
import Modal from './loginModal';
import AddIcon from '@mui/icons-material/Add';


export default function Navbar() {
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const [admin, setAdmin] = useState('')
    useEffect(() => {
        const token = Cookies.get('token');  // Get the token once
        if (token) {
            setAdmin(token);  // Update state with the token
        } else {
            setAdmin('');  // Ensure admin state is cleared if token is not present
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