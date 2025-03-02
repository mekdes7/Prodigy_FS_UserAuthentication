import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import roarLogo from '../assets/Roar.png';

const ResetPassword = () => {
  const { BackendURL } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOTP] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(BackendURL + '/api/auth/send-reset-OTP', { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
   
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join('');
      setOTP(otpArray.join(''))
      setIsOtpSubmitted(true);
  }   


  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(BackendURL + '/api/auth/reset-password', { email,otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login'); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-gray-100'>
      <img
        onClick={() => navigate('/')}
        src={roarLogo}
        alt='logo'
        className='absolute left-5 top-5 w-28 sm:w-32 sm:left-20 cursor-pointer'
      />

      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h2 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h2>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='mail' className='w-3 h-3' />
            <input
              type='email'
              placeholder='your email'
              className='bg-transparent outline-none text-white'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h2 className='text-white text-2xl font-semibold text-center mb-4'>Verify your OTP</h2>
          <p className='text-center mb-6 text-indigo-300'>Enter your 6-digit verification code sent to your email</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type='text'
                maxLength='1'
                key={index}
                required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      )}

      {isEmailSent && isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h2 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h2>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='mail' className='w-3 h-3' />
            <input
              type='password'
              placeholder='your new password'
              className='bg-transparent outline-none text-white'
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;