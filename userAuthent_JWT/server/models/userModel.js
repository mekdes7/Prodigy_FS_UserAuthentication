
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        
    },
    lastname: {
        type: String,
        required: true,
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOTP: {
        type: String,
        //required: true,
        default: " ",
    },
    verifyOTPexpire: {
        type: Number,
        //required: true,
        default:0,
    },
    isverified: {
        type:Boolean,
        //required: true,
        default:false,
    },
    resetOTP: {
        type:String,
        //required: true,
        default:" ",
    },
    
    resetOTPexpire: {
        type:Number,
        //required: true,
        default:0,
    },
});
const UserModel =mongoose.models.user||mongoose.model("User", userSchema);
export default UserModel;