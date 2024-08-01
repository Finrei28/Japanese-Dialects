import React, { useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputRow from '../utils/inputRow'
import LocalStates from '../utils/localStates'
import '../index.css'


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { alert, showAlert, hideAlert, loading, setLoading, success, setSuccess } = LocalStates();

  const query = useQuery();

  const handleChange = async (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    hideAlert();
    e.preventDefault();
    setLoading(true);
    if (!password) {
      showAlert({ text: 'please enter password' });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
        showAlert({ text: 'Passwords do not match' });
        setLoading(false);
        return;
    }
    try {
        await axios.post(`/api/v1/admin/reset-password`, {
        password,
        token: query.get('token'),
        email: query.get('email'),
      });
      
      setLoading(false);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      showAlert({
        text: `Success, redirecting to Home page shortly`,
        type: 'success',
      });
      setTimeout(() => {
        navigate('/')
      }, 3000);
    } catch (error) {
      showAlert({ text: error.response.data.msg });
      setLoading(false);
    }
  };
  return (
    <div className='page'>

      {!success ? (
        <form
          className={loading ? 'form form-loading' : 'form'}
          onSubmit={handleSubmit}
        >
          <h4>Reset Password</h4>
          {/* single form row */}
          <InputRow
            type='password'
            label='password'
            name='password'
            value={password}
            handleChange={handleChange}
          />
          <InputRow
            type='password'
            label='Confirm Password'
            name='confirmpassword'
            value={confirmPassword}
            handleChange={e => setConfirmPassword(e.target.value)}
          />
          {/* end of single form row */}
          {alert.show && (
            <div className={`alert alert-${alert.type}`}>{alert.text}</div>
                )}
          <button type='submit' className='btn btn-block' disabled={loading}>
            {loading ? 'Please Wait...' : 'Change Password'}
          </button>
          
        </form>
      )
      :
      (
        alert.show && (
          <div className={`alert alert-${alert.type}`}>{alert.text}</div>
              )
      )}

      
    </div>
  );
};



export default ResetPasswordForm;