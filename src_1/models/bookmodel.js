const mongoose=require("mongoose")
const bookSchema=new mongoose.Schema({
    // bookName: String,
     //authorName: String,
     //catagory: String, 
     //year: Number,
     bookName1: {
         type: String,
         required: true
     },
     author: String,
     tags: [ String ], //array of strings 
     year:{
          type:String,
         default :'2021'
     },
     stockavailable: {
         type: Boolean, //Boolean
         default: false
     },
     prices: {
         indianPrice: String,
         europeanPrice: String,
         
     },
     
     totalpages:Number,
     
 
 }, {timestamps: true} )
 
 module.exports=mongoose.model('bookcollection',bookSchema)