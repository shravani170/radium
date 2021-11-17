const mongoose=require("mongoose")
const bookSchema=new mongoose.Schema({
    // bookName: String,
     //authorName: String,
     //catagory: String, 
     //year: Number,
    name:"string",
    auther_id: {
        type:Number,
        required: true
    },
    price:Number,
   
    rating: Number, 
     
 
 }, {timestamps: true} )
 
 module.exports=mongoose.model('Bookdata',bookSchema)