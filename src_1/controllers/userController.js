const UserModel= require("../models/userModel.js")

const createNewBook= async function (req, res) {
    var data= req.body
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})    
}


const getBooklist= async function (req, res) {
    let allUsers= await UserModel.find(req.body).select({bookName1:"python",author:"npl"})
    
    
    
    res.send({msg: allUsers})
}

module.exports.createNewBook=createNewBook 
module.exports.getBooklist =getBooklist