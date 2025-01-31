import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../index.css'

const URL = process.env.REACT_APP_BASE_URL;

export default function Homepage() {
    const [alert, setAlert] = useState({
        show: false,
        text: '',
        type: 'danger',
    });

    const showAlert = ({ text, type = 'danger' }) => {
        setAlert({ show: true, text, type });
    };

    const hideAlert = () => {
        setAlert({ show: false, text: '', type: 'danger' });
    };

    const [vocab, setVocab] = useState({
        tokyoJapanese: [],
        miyazakiJapanese: [],
    })
    const [view, setView] = useState('tokyoJapanese');

    const alertTimeoutRef = useRef(null);

    const validateJapanese = (input) => {
        const japaneseRegex = /^$|^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+$/;
        return japaneseRegex.test(input);
    }

    const inputVocabChange = (e) => {
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        const value = e.target.value;
        if (validateJapanese(value)) {
            setVocab(
                prev => ({...prev, [e.target.name]: [value]})
            )
        }
        else {
            alertTimeoutRef.current = setTimeout(() => {
                showAlert({ text: 'Please enter only Hiragana, Katakana or Kanji' });
                setTimeout(() => {
                    hideAlert();
                }, 2000);
            }, 1000);
            
        }

    }
    const handleJapaneseChange = () => {
        hideAlert();
        setView(view === 'tokyoJapanese' ? 'miyazakiJapanese' : 'tokyoJapanese');
        setVocab({tokyoJapanese: [], miyazakiJapanese: [],})
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        if (view === 'tokyoJapanese') {
            if (vocab.tokyoJapanese.length === 0) return;
            const fetchMiyazakiVocab = async () => {
                try {
                    const res = await axios.get(`/api/v1/vocabularys/getMiyazakiVocabulary/${vocab.tokyoJapanese}`, { cancelToken: cancelToken.token });
                    const miyazakiJapanese = res.data.vocab.map((item) => item.miyazakiJapanese);
                    setVocab((prevVocab) => ({
                        ...prevVocab,
                        miyazakiJapanese: miyazakiJapanese,
                    }));
                } catch (error) {
                    if (axios.isCancel(error)) {
                    } else {
                        const { msg } = error.response?.data || {};
                        if (error.response?.status === 404) {
                            setVocab((prevVocab) => ({
                                ...prevVocab,
                                miyazakiJapanese: vocab.tokyoJapanese,
                            }));
                        }
                        if (msg) {
                            showAlert({ text: msg });
                        }
                    }
                }
            };

            fetchMiyazakiVocab();

        } else {
            if (vocab.miyazakiJapanese.length === 0) return;
            const fetchTokyoVocab = async () => {
                try {
                    const res = await axios.get(`/api/v1/vocabularys/getTokyoVocabulary/${vocab.miyazakiJapanese}`, { cancelToken: cancelToken.token });
                    const tokyoJapanese = res.data.vocab.map((item) => item.tokyoJapanese);
                    setVocab((prevVocab) => ({
                        ...prevVocab,
                        tokyoJapanese: tokyoJapanese,
                    }));
                } catch (error) {
                    if (axios.isCancel(error)) {
                    } else {
                        const { msg } = error.response?.data || {};
                        if (error.response?.status === 404) {
                            setVocab((prevVocab) => ({
                                ...prevVocab,
                                tokyoJapanese: vocab.miyazakiJapanese,
                            }));
                        }
                        if (msg) {
                            showAlert({ text: msg });
                        }
                    }
                }
            };

            fetchTokyoVocab();
        }

        return () => {
            cancelToken.cancel();
        };

    }, [vocab.tokyoJapanese, vocab.miyazakiJapanese]);


    return (
        <>
        <div className='homepage-container'>
        <h3 className='homepage-title'>Tokyo Dialect - Miyazaki Dialect</h3>
        {view === 'tokyoJapanese' ? (
            <>
                <label htmlFor='tokyoJapanese'>Tokyo Japanese:</label>
                <input type='text' id='tokyoJapanese' name='tokyoJapanese' value={vocab.tokyoJapanese} className='vocab' onChange={inputVocabChange} ></input>
                <button style={{marginBottom:'20px'}} onClick={handleJapaneseChange}>Swap</button>
                <label htmlFor='miyazakiJapanese' >Miyazaki Japanese:</label>
                <div className='results-container'>
                {vocab.miyazakiJapanese.map((item, index) => (
                <div key={index} className='results'>
                {item}
                </div>
                ))}
                </div>
            </>
        )
        :
        (
        <>
            <label htmlFor='miyazakiJapanese'>Miyazaki Japanese:</label>
            <input type='text' id='miyazakiJapanese' name='miyazakiJapanese' value={vocab.miyazakiJapanese} className='vocab' onChange={inputVocabChange} ></input>
            <button style={{marginBottom:'20px'}} onClick={handleJapaneseChange}>Swap</button>
            <label htmlFor='tokyoJapanese'>Tokyo Japanese:</label>
            <div className='results-container'>
            {vocab.tokyoJapanese.map((item, index) => (
            <div key={index} className='results'>
              {item}
            </div>
            ))}
            </div>
            
        </>
        )}
        {alert.show && (
            <p className={`homePageAlert alert-${alert.type}`} style={{ color: 'red', marginTop: '5px' }}>{alert.text}</p>
       )}
        </div>
        
        </>
        
    )
    
}