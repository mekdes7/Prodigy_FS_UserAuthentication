import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import roarLogo from '../assets/Roar.png';

const Login = () => {
  const navigate = useNavigate();
  const { BackendURL, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [firstname, setFname] = useState('');
  const [lastname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

 
  const validateInputs = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (state === 'Sign Up' && !nameRegex.test(firstname.trim())) {
      newErrors.firstname = 'First Name must contain only letters and be at least 2 characters long';
    }

    if (state === 'Sign Up' && !nameRegex.test(lastname.trim())) {
      newErrors.lastname = 'Last Name must contain only letters and be at least 2 characters long';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!passwordRegex.test(password.trim())) {
      newErrors.password =
        'Password must be at least 6 characters long and include one uppercase, one lowercase, one digit, and one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

 
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post(
        BackendURL + (state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login'),
        { firstname, lastname, email, password }
      );

      if (response.data.success) {
        if (state === 'Sign Up') {
         
          toast.success('Registration successful! Please log in.');
          navigate('/login'); 
        } else {
         
          setIsLoggedin(true);
          await getUserData();
          toast.success(response.data.message);
          navigate('/'); 
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100">
     
      <img
        onClick={() => navigate('/')}
        src={roarLogo}
        alt="logo"
        className="absolute left-5 top-5 w-28 sm:w-32 sm:left-20 cursor-pointer"
      />

     
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 sm:w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}
        </h2>

       
        <form className="flex flex-col gap-4 mt-4" onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <>
            
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 bg-[#333A5C] rounded-full w-full px-5 py-2.5">
                  <img src={assets.person_icon} alt="icon" className="w-5 h-5 invert" />
                  <input
                    onChange={(e) => setFname(e.target.value)}
                    value={firstname}
                    type="text"
                    placeholder="Firstname"
                    className="bg-transparent focus:outline-none text-white w-full"
                  />
                </div>
                {errors.firstname && (
                  <p className="text-red-500 text-sm text-left pl-5">{errors.firstname}</p>
                )}
              </div>

             
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 bg-[#333A5C] rounded-full w-full px-5 py-2.5">
                  <img src={assets.person_icon} alt="icon" className="w-5 h-5 invert" />
                  <input
                    type="text"
                    onChange={(e) => setLname(e.target.value)}
                    value={lastname}
                    placeholder="Lastname"
                    className="bg-transparent focus:outline-none text-white w-full"
                  />
                </div>
                {errors.lastname && (
                  <p className="text-red-500 text-sm text-left pl-5">{errors.lastname}</p>
                )}
              </div>
            </>
          )}

          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 bg-[#333A5C] rounded-full w-full px-5 py-2.5">
              <img src={assets.mail_icon} alt="icon" className="w-5 h-5" />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="bg-transparent focus:outline-none text-white w-full"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm text-left pl-5">{errors.email}</p>
            )}
          </div>

          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 bg-[#333A5C] rounded-full w-full px-5 py-2.5">
              <img src={assets.lock_icon} alt="icon" className="w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                className="bg-transparent focus:outline-none text-white w-full"
              />
              <img
                src={showPassword ? assets.eye_closed_icon : assets.eye_open_icon}
                alt="toggle password visibility"
                className="w-5 h-5 cursor-pointer filter invert"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm text-left pl-5">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password (Login only) */}
          {state === 'Login' && (
            <p
              onClick={() => navigate('/reset-password')}
              className="mb-4 text-indigo-500 cursor-pointer text-sm text-right"
            >
              Forgot Password?
            </p>
          )}

          {/* Submit Button */}
          <button className="bg-gray-800 text-white py-2 rounded-full hover:bg-gray-700 transition-all">
            {state}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <button
          className="mt-4 text-blue-500 underline cursor-pointer"
          onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
        >
          {state === 'Sign Up' ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Login;