import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { verify } = jwt;

import UserModel from "../models/userModel.js";

import { transporter, sendMail } from "../config/nodeMailer.js";


export const register = async (req, res) => { 
    const { firstname, lastname, email, password } = req.body;

   
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }     

        
        const hashedPassword = await bcrypt.hash(password, 12);

        
        const user = new UserModel({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        await user.save();

       
        const token = jwt.sign( 
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        await sendMail(email);

        return res.json({success:true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

    export const login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        try {
            const user = await UserModel
                .findOne({ email })
               
            if (!user) {
                return res.status(400).json({success:false, error: "email is not existed" });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            
            if(!isPasswordMatch){
                return res.status(400).json({success:false, error:"password is incorrect"});
            }
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
            
            return res.json({success:true, message: "Login successful" });
        }
        catch(error){
            console.error("Error in login:", error);
            res.status(500).json({success:false, error: "Server error" });

        }
    }
    export const logout = async (req, res) => {
        try {
        res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
        
        return res.json({success:true, message: "Logged out" });
} catch (error) {
    console.error("Error in logout:", error);
    }}

export const sendverifyOTP = async (req, res) => {
   
    
    try {
       const {userId} = req.body;
       const user = await UserModel.findById(userId);
       if(user.isverified){
           return res.status(400).json({success:false, error:"User already verified"});
       }
         const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.verifyOTP = otp;
            user.verifyOTPexpire = Date.now() + 1800000; 
            await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email, // Now using the passed email parameter
            subject: 'Account verification',
            text: `your OTP is ${otp}  this will expire in 30 minutes`,
        
            }
            await transporter.sendMail(mailOptions);
            return res.json({success:true, message: "OTP sent" });
        } catch (error) {
        console.error("Error in verify:", error);
        res.status(500).json({ error: " error sending message" });
    }}
    export const verifyEmail= async (req, res) => {
        
            const { userId, otp } = req.body;
            
            if (!userId || !otp) {
                return res.status(400).json({success:false, error: "Please fill all the fields" });
                
            }
            try {
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({success:false, error: "User not found" });
                }
            if (user.verifyOTP !== otp||user.verifyOTP===" ") {
                return res.status(400).json({success:false, error: "Invalid OTP" });
            }
            if (user.verifyOTPexpire < Date.now()) {
                return res.status(400).json({success:false, error: "OTP expired" });
            }
            user.isverified = true;
            user.verifyOTP = " ";
            user.verifyOTPexpire = 0;
            await user.save();
            return res.json({success:true, message: "Email verified successfully" });
        } catch (error) {
            console.error("Error in verifyEmail:", error);
            res.status(500).json({ error: "error verifying email" });
        }
    }
  export const isAuthenticated = async (req, res) => {
    try{
return res.json({success:true, message: "You are authenticated" });  
    }
    catch(error){
        res.status(500).json({success:false, message: error.message });
    }
  }

  export const sendResetOTP = async (req, res) => {
    
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({success:false, error: "email is required" });
        }
    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(404).json({success:false, error: "User not found" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOTP = otp;
        user.resetOTPexpire = Date.now() + 1800000;
        await user.save();
    const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email, // Now using the passed email parameter
            subject: 'password reset',
            text: `your OTP is for OTP is :${otp} this will expire in 30 minutes 
            use this otp to reset your password`,
        
            };
            await transporter.sendMail(mailOptions);
            return res.json({success:true, message: "OTP sent to you again" });
    } catch (error) {
        console.error("Error in sendResetOTP:", error);
        res.status(500).json({ error: "error sending message", message: error.message });
    }
}
   export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({success:false, error: "Please fill all the fields" });
    }
    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(404).json({success:false, error: "User not found" });
        }
        if (user.resetOTP !== otp||user.resetOTP===" ") {
            return res.status(400).json({success:false, error: "Invalid OTP" });
        }
        if (user.resetOTPexpire < Date.now()) {
            return res.status(400).json({success:false, error: "OTP expired" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.resetOTP = " ";
        user.resetOTPexpire = 0;
        await user.save();
        res.json({success:true, message: "Password reset successfully" });
          
   }   catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ error: "error resetting password",message: error.message });
    }
} 