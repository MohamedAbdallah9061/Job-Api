const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {UnauthenticatedError}=require('../errors');
const { compareSync } = require('bcryptjs');

const auth =async (req,res,next)=>
{
    const authheader =req.headers.authorization;
    if(!authheader || !authheader.startsWith('Bearer'))
    {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token=authheader.split(' ')[1];
    try {
        const payload= await jwt.verify(token,process.env.JWT_SECRET);
        req.user={userId:payload.userId,name:payload.name};
        next();

    } catch (error) {
        console.log(error);
          throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports=auth;