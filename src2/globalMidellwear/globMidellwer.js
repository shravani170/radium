const jwt=require('jsonwebtoken')

const tokenCheck=function(req,res,next){
 const  token=req.headers['x-auth-token']
 let  decoded=jwt.verify(token,'unlock')
    if(decoded){
        req.decoded=decoded
        next()
    }else{
        res.status(400).send({status:false,mesg:'invalid token'})
    }
 }
 module.exports.tokenCheck = tokenCheck