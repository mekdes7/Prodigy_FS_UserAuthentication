import express from 'express';
import {isAuthenticated, login,logout,register,  resetPassword,  sendResetOTP,  sendverifyOTP,  verifyEmail } from '../controllers/authControl.js';
import userAuth from '../middleWare/userAuth.js';


const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-OTP',userAuth, sendverifyOTP);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-OTP',sendResetOTP);
authRouter.post('/reset-password',resetPassword);
export default authRouter;