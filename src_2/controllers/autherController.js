const mongoose=require("mongoose")
const autherModel= require("../models/autherModel")

const addThisauther= async function (req, res) {
    var data= req.body
    let savedAuther= await autherModel.create(data)
    res.send({msg: savedAuther})    
}



module.exports.addThisauther=addThisauther 