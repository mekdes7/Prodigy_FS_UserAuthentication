import React, { useEffect } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import roarLogo from '../assets/Roar.png';

const EmailVerify = () => {
  axios.defaults.withCredentials=true;
const navigate=useNavigate()
const {BackendURL,isLoggedin,userData,getUserData}=useContext(AppContext)

const inputRefs=React.useRef([])

const handleInput=(e,index)=>{
  if(e.target.value.length > 0 && index<inputRefs.current.length-1){
    inputRefs.current[index+1].focus();
  }
}
const handleKeyDown=(e,index)=>{
  if(e.key==='Backspace' && e.target.value==='' && index>0){
    inputRefs.current[index-1].focus();
  }
}
const handlePaste=(e)=>{
  const paste=e.clipboardData.getData('text')
  const pasteArray=paste.split('');
  pasteArray.forEach((char,index)=>{
    if(inputRefs.current[index]){
      inputRefs.current[index].value=char;
    }
  })
}
const onSubmitHandler= async(e)=>{
  try {
    e.preventDefault();
    const otpArray=inputRefs.current.map(e=>e.value)
    const otp=otpArray.join('')

    const{data}=await axios.post(BackendURL+'/api/auth/verify-account',{otp})
    if(data.success){
      toast.success(data.message)
      getUserData()
      navigate('/')
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}
useEffect(()=>{
  isLoggedin && userData && userData.isverified && navigate('/')
},[isLoggedin,userData])

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100">
      <img onClick={()=>navigate('/')} 
              src={roarLogo} 
              alt="logo" 
              className="absolute left-5 top-5 w-28 sm:w-32 sm:left-20 cursor-pointer"
            />
      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'onSubmit={onSubmitHandler}>
<h2 className='text-white text-2x1 font-semibold text-center mb-4'>Email verify otp</h2>
<p className='text-center mb-6 text-indigo-300'>enter your 6 digit verification code sent to your email</p>
<div className='flex justify-between mb-8'onPaste={handlePaste}>
{Array(6).fill(0).map((_, index)=>(
  <input type='text' maxLength='1' key={index}required
  className='w-12 h-12 bg-[#333A5C] text-white text-center text-x1 rounded-md'
  ref={e=>inputRefs.current[index]=e}
  onInput={(e)=>handleInput(e,index)}
  onKeyDown={(e)=>handleKeyDown(e,index)}
  />
))}
</div>
<button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Email Verify</button>
      
      
      </form>
    </div>
  )
}

export default EmailVerify
