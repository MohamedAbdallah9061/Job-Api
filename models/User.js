const { string, func } = require('joi');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const userShema=mongoose.Schema({
    name:
    {
        type:String,
        required:[true,"Please Provide Name"],
        minlength:3,
        maxlength:50,
    },
    email:
    {
        type:String,
        required:[true,'Please Provide email'],
        minlength:3,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please Provide vaild email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Please Provide Password'],
        minlength:3,

    }
})

userShema.pre('save',async function()
{
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
userShema.methods.createJWT=function ()
{
return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:'12h'});
}

userShema.methods.comparepassword=async function(candidatepassword)
{
    const ismatch=await bcrypt.compare(candidatepassword,this.password);
    return ismatch
}
module.exports=mongoose.model('User',userShema);
