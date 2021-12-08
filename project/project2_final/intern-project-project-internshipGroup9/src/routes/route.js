const express=require('express')
const router = express.Router();
const collegeController=require('../controllers/collegeController')
const internController=require('../controllers/internController')
router.post('/colleges',collegeController.registerCollege)
router.get('/test-me',function(req,res){
    res.send({"msg":'hi'})
})
router.post('/interns',internController.registerIntern)
router.get('/collegeDetails',internController.internList)


module.exports=router

