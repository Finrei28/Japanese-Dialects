import React from 'react';

const InputRow = ({ type, label, name, value, handleChange }) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className='form-input'
      />
    </div>
  );
};

export default InputRow;