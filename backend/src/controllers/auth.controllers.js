import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"


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
             await newUser.save()
            generateToken(newUser._id, res)

            res.status(201).json({_id:newUser._id,fullName:newUser.fullName,email:newUser.email,profilePic: newUser.profilePic})
        }else{
            return res.status(400).json({message:"Invalid user data"})
        }
        
    }catch(error){
        console.log("Error in sign up controller:", error)
        return res.status(500).json({message:"Internal Server error"})
    }
}

export const login = async (req,res) => {
    const {email,password}=req.body
    
    if(!email || !password){
        return res.status(400).json({message:"Enter all Fields"})
    }
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({message:"Theres no user with this email"})
    }else{
        if(await bcrypt.compare(password, user.password)){
            return res.status(200).json({message: "Welcome back"})
        }
    }
}