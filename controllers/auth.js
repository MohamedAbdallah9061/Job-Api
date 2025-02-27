
const User=require('../models/User');
const {StatusCodes}=require('http-status-codes');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const{BadRequestError,UnauthenticatedError}=require('../errors');
require('dotenv').config()
const register=async(req,res)=>
{
    const user=await User.create({...req.body});

    const token=user.createJWT()

    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
}
const login=async(req,res)=>
{
    const {email,password}=req.body;
    if(!email||!password)
    {
        throw new BadRequestError('Please Provide Email and Password');
    }
    const user=await User.findOne({email});
    if(!user)
    {
        throw new UnauthenticatedError('invaild credentials')
    }
    const isPasswordCorrect= await user.comparepassword(password);
    if(!isPasswordCorrect)
    {
        throw new UnauthenticatedError('invaild credentials')
    }
    const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({token});
}


module.exports={register,login}