const mongoose=require("mongoose")
const Bookmodel=require("../models/Bookmodel")

const autherModel = require("../models/autherModel")
const addThisBook= async function (req, res) {
    var newData= req.body
    let savedData= await Bookmodel.create(newData)
    res.send({msg: savedData}) 
} 
//sol1 to get chetan bhagat book
const getchetanBhagatBooks= async function (req, res) {
    
    let bhagatDetail= await autherModel.find({author_name:"Chetan Bhagat"})
   let abc=bhagatDetail[0].auther_id
    //author_id:1,

    //author_name:"Chetan Bhagat",

    //age:25,

   // address:"New delhi"
   let ans1=await Bookmodel.find({auther_id:abc})
    res.send({msg: ans1}) 
} 
//sol2
// const updatePrice= async function (req, res) {
    
//     let bhagatDetail= await Bookmodel.findOne({name:"Two States"}).select({auther_id:1,_id:0})
//     let auther=await autherModel.findOne(bhagatDetail).select({author_name:1, _id:0})
//   letupdatedPrice
//     res.send({msg: ans1}) 
// } 

module.exports.addThisBook=addThisBook;
 module.exports.getchetanBhagatBooks=getchetanBhagatBooks;

