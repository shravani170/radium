// //const bookModel=require("./bookModal")
// const mongoose=require("mongoose")
// const authorsSchema=new mongoose.Schema({
//       author_id:{
//        type:Number,
//        required:true
//       },
//     author_name:String,

//     age:Number,

//     address:String
// },{timestamps: true})
// module.exports=mongoose.model("author",authorsSchema)

// //module.exports=
const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({

   author_id: {
      type: Number,
      required: true
   },
   author_name: {
      type: String,
      required: true
   },
   BookName: String,
   age: Number,
   Address: String,
},

   { timestamps: true })


module.exports = mongoose.model('author', authorSchema)