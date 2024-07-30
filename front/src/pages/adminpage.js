import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../index.css'
import Cookies from 'js-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RegisterModal from '../componenets/registerModal';

const URL = process.env.REACT_APP_BASE_URL;

export default function AdminPage() {

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        text: '',
        type: 'danger',
    });

    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate("/")
        }
    })

    const showAlert = ({ text, type = 'danger' }) => {
        setAlert({ show: true, text, type });
    };

    const hideAlert = () => {
        setAlert({ show: false, text: '', type: 'danger' });
    };

    const [vocab, setVocab] = useState({
        tokyoJapanese: '',
        miyazakiJapanese: '',
    })

    const inputVocabChange = (e) => {
        setVocab(
            prev => ({
                ...prev, [e.target.name]: e.target.value
            })
        )
    }

    const handleAddVocabulary = async (e) => {
        e.preventDefault();
        hideAlert();
        const { tokyoJapanese, miyazakiJapanese } = vocab;
        const newVocab = { tokyoJapanese, miyazakiJapanese};
        try {
            const { data } = await axios.post(`/api/v1/vocabularys`, newVocab);
            showAlert({ text: data.msg , type: 'success'});
            setVocab({ tokyoJapanese: '', miyazakiJapanese: '' })
        } catch (error) {
            const { msg } = error.response.data;
            showAlert({ text: msg || 'there was an error' });
            setTimeout(() => {
                hideAlert();
            }, 3000);
        }
    }
    const handleLogout = async () => {
        await axios.post(`/api/v1/admin/logout`);
        navigate("/")
    }

    const handleModalOpen = async () => {
        setModalOpen(true)
    }

    const handleModelClose = async () => {
        setModalOpen(false)
    }


    return (
        <>
        <div className='dashboardNavbar'>
            <div className='homePageButton'>
                { <ArrowBackIcon fontSize='large' onClick={() => navigate("/")}>Home</ArrowBackIcon>}
            </div>
            <div className='logoutButton'>
                { <button onClick={handleModalOpen}>Register Admin</button>}
                <RegisterModal open={modalOpen} onClose={handleModelClose}> </RegisterModal>
            </div>
            <div className='logoutButton'>
                { <button onClick={handleLogout}>Log out</button>}
            </div>
        </div>
        <div className='adminpage-container'>
            <h3 className='adminpage-title'>Add a new vocabulary</h3>

                <label htmlFor='tokyoJapanese'>Tokyo Japanese:</label>
                <input type='text' id='tokyoJapanese' name='tokyoJapanese' value={vocab.tokyoJapanese} className='vocab' onChange={inputVocabChange} ></input>
                <label htmlFor='miyazakiJapanese'>Miyazaki Japanese:</label>
                <input type='text' id='miyazakiJapanese' name='miyazakiJapanese' value={vocab.miyazakiJapanese} className='vocab' onChange={inputVocabChange}></input>
                <button onClick={handleAddVocabulary}>Add vocabulary</button>

            
            {alert.show && (
                <p className={`homePageAlert alert-${alert.type}`} >{alert.text}</p>
            )
            }
        </div>
        </>
    )
}