import React from 'react';

const VerificationModal = ({handleVerification, verificationCode, InputRow, alert, LoadingButton, loading, handleVerificationCode}) => {
    return (
        <form className="form modal-form" onSubmit={handleVerification}>

                        <h1 style={{textAlign:'center', marginTop:'-5%'}}>Verify your email</h1>

                        <InputRow
                            type='text'
                            label="verification code"
                            name='verificationCode'
                            value={verificationCode}
                            handleChange={handleVerificationCode}
                        />

                        {alert.show && (
                            <p className={`verificationAlert alert-${alert.type}`}>{alert.text}</p>
                        )
                        }
                        <div style={{ textAlign:'center', color:'pink'}}>
                            <div>
                                <LoadingButton
                                onClick={handleVerification}
                                loading={loading}
                                loadingIndicator="Verifying…"
                                variant="outlined"
                                sx={{ color: 'blue', borderColor:'hotpink', borderRadius: '10px'}}
                                >
                                <span>Verify Code</span>
                                </LoadingButton>

                        </div>
                        </div>
                        
                        
                    </form>
    )
}

export default VerificationModal