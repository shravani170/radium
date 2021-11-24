const express = require('express')
const router = express.Router();
const jwt=require('jsonwebtoken')
const globMidellwer=require('../globalMidellwear/globMidellwer')
const user=require('../controllers/userControllers')



router.post('/creatUser',user.createUser)
router.post('/login',user.login)
router.get('/user/:userId',globMidellwer.tokenCheck,user.getUser)
router.put('/user/:userId',globMidellwer.tokenCheck,user.updateEmail)
module.exports = router;
