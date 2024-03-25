const Job=require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,NotFoundError}=require('../errors');
const getAlljobs=async (req,res)=>
{
    const jobs=await Job.find({createdBy:req.user.userId});
    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}
const getjob=async(req,res)=>
{
    const {user:{userId},params:{id:jobid}}=req;
    const job = await Job.findOne({
        _id:jobid,
        createdBy:userId,
    })
    if(!job)
    {
        throw new NotFoundError(`No job with id ${jobid}`);
    }
    res.status(StatusCodes.OK).json({ job })
}

const createjob=async(req,res)=>
{
    req.body.createdBy=req.user.userId
    const job=await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}
const updateJob=async(req,res)=>
{
    const {
        body:{company,position},
        user:{userId},
        params:{id:jobid}
    }=req;
    if(company===''||position==='')
    {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job= await Job.findByIdAndUpdate({_id:jobid,createdBy:userId},req.body,{new:true,runValidators:true});
    res.status(StatusCodes.OK).json(job);
}
const deleteJob=async(req,res)=>
{
    const {user:{
        userId
    },params:
    {id:jobid}}=req;
const job=await Job.findByIdAndRemove({_id:jobid,createdBy:userId})
   if(!job)
   {
    throw new NotFoundError(`No Job With id ${jobid}`);
   }
    res.status(StatusCodes.OK).json({job});
}
module.exports={getAlljobs,getjob,createjob,updateJob,deleteJob};
