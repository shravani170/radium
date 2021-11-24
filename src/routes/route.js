const express = require('express');
const router = express.Router();

const userControllers=require('../controllers/userControllers')
const producteControllers=require('../controllers/producteControllers')
const mid= require("../middlewares/globalMiddleware")
const price=require("../controllers/priceControllers")
// router.post('/test-me', function (req, res, next) {    
//     console.log('Inside the route handler checking the header batch: '+req.headers['batch'])
//     let host = req.headers['host']
//     let hostWithName = host + " " + "Sabiha Khan"
//     console.log('My response headers: '+res.getHeaderNames())
//     res.setHeader('hostWithName', hostWithName)
//     //res.send({data: 'I was in the handler'})
//     //res.finalData = {data: 'I was in the handler'}
//     next()
// });

router.post('/createUser',mid.captureInfo,userControllers.createUser)

router.post('/producte',producteControllers.prouduct1)

router.post('/price',mid.captureInfo,price.createOrder)


module.exports = router;