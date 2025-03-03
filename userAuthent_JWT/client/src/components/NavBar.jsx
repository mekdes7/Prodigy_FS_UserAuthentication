import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import roarLogo from '../assets/Roar.png';

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, BackendURL, setUserData, setIsLoggedin } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(BackendURL + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong"); 
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(BackendURL + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong"); 
    }
  };

  return (
    <div className='flex justify-between items-center p-4'>
      <img src={roarLogo} alt="logo" className='w-28 sm:w-32' />

      {userData ? (
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
          {userData.firstname[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-0 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isverified && (
                <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>
                  Verify email
                </li>
              )}
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-20'>
                LogOut
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
        onClick={() => navigate('/login')}
        className='flex items-center gap-2 border border-black rounded-full px-6 py-2 text-white bg-black hover:bg-gray-800 hover:scale-105 transition-all duration-300'
      >
        Get Started
        <img src={assets.arrow_icon} alt='arrow' className='filter invert hover:brightness-75 transition-all duration-300' /> {/* White arrow with hover effect */}
      </button>
      )}
    </div>
  );
};

export default NavBar;