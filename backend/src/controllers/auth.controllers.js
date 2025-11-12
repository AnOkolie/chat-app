import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { ENV } from "../lib/env.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res) => {
    const {fullName,email,password} = req.body
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"})
        }
        const user =  await User.findOne({email}) //find a user using the user model with the email
        if(user){
            return res.status(400).json({message:"Email already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({fullName,email,password:hashPassword})
        if (newUser){
            const savedUser = await newUser.save()
            generateToken(newUser._id, res)
            res.status(201).json({_id:newUser._id,fullName:newUser.fullName,email:newUser.email,profilePic: newUser.profilePic})
            try{
                await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL)
            }catch(error){
                console.log("error sending user email",error)
            }
            
        }else{
            return res.status(400).json({message:"Invalid user data"})
        }
        
    }catch(error){
        console.log("Error in sign up controller:", error)
        return res.status(500).json({message:"Internal Server error"})
    }
}

export const login = async (req,res) => {
    try{
        const {email,password}=req.body
    
    if(!email || !password){
        return res.status(400).json({message:"Enter all Fields"})
    }
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({message:"Invalid Credentials"})
    }else{
        if(await bcrypt.compare(password, user.password)){
            generateToken(user._id,res)
            return res.status(200).json({_id: user._id, fullName: user.fullName,email:user.email,profilePic:user.profilePic})
        }else{
            return res.status(400).json({message:"Invalid Credentials"})
        }
    }
    }catch(error){
        console.log("Error in login controller")
        return res.status(500).json({message:"Internal Server Error"})
    }
    
}

export const logout = async (_,res) => {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message: "Logged out successfully"})
}

export const updateProfile = async (req,res) => {
    try{
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({messsage:"Profile pic is required"})

        const userId = req.user._id
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url},{new:true});

        res.status(200).json(updateUser)
    }catch(error){
        console.log("error in update profile:", error);
        res.status(500).json({message: "Internal server error"})
    }
}