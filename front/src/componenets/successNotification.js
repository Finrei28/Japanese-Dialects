import React from 'react';

const SuccessNotification = ({ message }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '75%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'green',
            color: 'white',
            padding: '10px',
            width: '10%',
            textAlign: 'center',
            zIndex: '9999',
            border: 'none',
            borderRadius: '8px',
        }}>
            {message}
        </div>
    );
};

export default SuccessNotification;