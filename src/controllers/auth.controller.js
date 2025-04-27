import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup=async (req,res)=>{
   try {
    const {email,password}=req.body;
    console.log(email,password);
    if(!email || !password){
        return res.status(400).json({error:'Please fill all fields'});
    }
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({error:'User already exists'});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUser=new User({
        email,
        password:hashedPassword
    })
    await newUser.save();
    //generate token
    const token=jwt.sign(
        {userId:newUser._id},
        process.env.JWT_SECRET,
        {expiresIn:'1h'}
    );
    // Send token as a cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 3600000, // 1 hour in milliseconds
      });
  
    res.status(201).json({
        message:'User created successfully',
        token,
        user:{
            id:newUser._id,
            email:newUser.email
        }
    });
   } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal server error'});
   }
};
export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({error:'Please fill all fields'});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:'Invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({error:'Invalid credentials'});
        }
        //generate token
        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        // Send token as a cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
      
      });
  
        res.status(200).json({
            message:'User logged in successfully',
            token,
            user:{
                id:user._id,
                email:user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal server error'});

    }
    }
export const logout=async (req,res)=>{
    
    try {
        res.clearCookie('token');
        res.status(200).json({message:'User logged out successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal server error'});
    }

}
