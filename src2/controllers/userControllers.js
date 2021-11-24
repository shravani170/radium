const userModel = require("../models/userModels.js")

const jwt=require('jsonwebtoken')


const createUser = async function (req, res) {

    const User = req.body


    let savedUser = await userModel.create(User)
    
    res.status(200).send({ msg: savedUser })
}

const login= async function (req, res) {
    let userName= req.body.user_name
    let userPassword= req.body.pasword
    let validUser = await userModel.findOne({ user_name: userName, pasword: userPassword, isDeleted: false})
    console.log(validUser,req.body)
    if (validUser){
        let userToken = jwt.sign({ userId: validUser._id }, 'unlock');
        //res.header('x-auth-token', userToken).status(200).send({msg: " this is my msg"})
            res.status(200).send({status: true, data: validUser, token:userToken})         
    }else res.status(400).send({status: false, message: "invalid user"}) 
}
const getUser= async function(req,res){
        let decodedToken=req.params.userId
        console.log(decodedToken,'hi')
        console.log(req.decoded.userId,'hiiii')
        if(req.decoded.userId==decodedToken){
            let userDetail=await userModel.findOne({_id:decodedToken,isDeteted:false})
            if(userDetail){
                res.status(200).send({status:false,message:userDetail})
            }else{
                res.status(400).send({status:false,message:'user not found'})
            }
        }else{
            res.send({status:false,data:'user not authorised'})
        }
 
}
const updateEmail= async function(req,res){
    let decodedToken=req.params.userId
    let newEmail=req.body.email
    console.log(req.decoded.userId)
    if(req.decoded.userId==decodedToken){
        let userDetail=await userModel.findOne({_id:decodedToken,isDeteted:false})
        if(userDetail){
            let updetedEmail=await userModel.findOneAndUpdate({_id:decodedToken,isDeleted:false},{email:newEmail},{new:true})
            res.status(200).send({status:false,message:updetedEmail})
        }else{
            res.status(400).send({status:false,message:'user not found'})
        }
    }else{
        res.status(400).send({status:false,data:'user not authorised'})
    }

}


module.exports.createUser = createUser
module.exports.login=login
module.exports.getUser=getUser
module.exports.updateEmail=updateEmail