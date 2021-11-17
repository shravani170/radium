const Bookmodel=require("../models/bookmodel.js")
const mongoose=require("mongoose")
const bookmodel= require("../models/bookmodel.js")
const createNewBook= async function (req, res) {
    var book= req.body
    let savedBook= await Bookmodel.create(book)
    res.send({msg: savedBook}) 
} 
const allBooklist= async function (req, res) {
 
    let list= await Bookmodel.find().select({bookName1: 1,author: 1, _id: 0})
    res.send({msg: list})  
} 
const ParticularBook= async function (req, res) {
 
    let spesificBook= await Bookmodel.find(req.body)
    res.send(spesificBook)
   
} 
const yearDetails= async function (req, res) {
 
    let yearList= await Bookmodel.find({year:req.body.year}).select({bookName1: 1, _id: 0})
    res.send(yearList)
   
} 
const priceDetails= async function (req, res) {
 
    let list= await Bookmodel.find({$or:[{"price.indianPrice":"100rs"},{"price.indianPrice":"200rs"},{"price.indianPrice":"500rs"}]}).select({bookName1: 1, _id: 0})
    res.send({msg:list})
   
} 
const randomBooks= async function (req, res) {
 
    let allBooks= await Bookmodel.find({$or:[{stockavailable: true},{ totalpages:{$gt:500}}]})
    res.send({msg:allBooks})
   
} 
module.exports.createNewBook=createNewBook;
module.exports.allBooklist=allBooklist;
module.exports.ParticularBook=ParticularBook;
module.exports. yearDetails= yearDetails;
module.exports.priceDetails=priceDetails;
module.exports.randomBooks=randomBooks;