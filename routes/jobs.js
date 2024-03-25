const express=require('express');
const {getAlljobs,getjob,createjob,updateJob,deleteJob}=require('../controllers/jobs');
const router=express.Router();


router.route('/').post(createjob).get(getAlljobs);
router.route('/:id').get(getjob).delete(deleteJob).patch(updateJob);


module.exports=router;