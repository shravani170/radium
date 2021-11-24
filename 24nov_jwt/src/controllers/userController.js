//const UserModel = require("../models/userModel.js")
const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel.js")


const createUser = async function (req, res) {
    try {
    var data = req.body
    let savedData = await userModel.create(data);
    res.status(201).send({status: false, data: savedData});
    } catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}


const login = async function (req, res) { 
    try {
    userName = req.body.name
    userPassword = req.body.password

    let user = await userModel.findOne({ name: userName, password: userPassword, isDeleted: false })
    if (user) {
        const generatedToken = jwt.sign({ userId: user._id }, "Radium")
        res.status(200).send({ status: true, data: user._id, token: generatedToken })
    } else {
        res.status(400).send({ status: false, message: 'Invalid credentials' })
    }
} catch(error){
    res.send(500).send({status:false, message:error.message})
    }
}


const getDetails = async function (req, res) {

    try{
        let userId = req.params.userId
        let decodeUserToken = req.user
        if(userId == decodeUserToken.userId) {
        let userDetails = await userModel.findOne({ _id:userId, isDeleted: false })
            if (userDetails) {
                res.status(200).send({ status: true, data: userDetails })
            } else {
                res.status(404).send({ status: false, message: 'User not found' })
            }
         
         }    else 
         res.status(403).send({status:false, message:"prohibited is maybe trying to access a different user's account"})
    } catch(error){
        res.status(500).send({status:false, message: error.message})
    }

    } 
        

const updateUser = async function (req, res) {
    try {
    let userId = req.params.userId
    let emailId = req.body.emailId
    let decodedUserToken = req.user
    if(userId == decodedUserToken.userId) {

     let userDetails = await userModel.findOneAndUpdate({ "_id": userId }, { "emailId": emailId }, { new: true })
            if (userDetails) {
                res.status(200).send({ status: true, message: userDetails })
            } else {
                res.status(404).send({ status: false, msg: "no such user exist " })
            } 
        } else 
        res.status(403).send({status:false, message:"prohibited as maybe trying to access a different user's account"})
        } catch(error){
            res.status(500).send({status:false, message: error.message})
        }
    
    }  
    


module.exports.createUser = createUser
module.exports.login = login
module.exports.getDetails = getDetails
module.exports.updateUser = updateUser