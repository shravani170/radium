// const mongoose=require("mongoose")
// const booksSchema=new mongoose.Schema({

//         name:String,

//         author_id:Number,

//         price:Number,

//         ratings:Number,
// },{timestamps:true})
// module.exports=mongoose.model("book",booksSchema)
const mongoose = require('mongoose')

const Book2Schema = new mongoose.Schema({

    name:String,

    author_id:Number,

    price:Number,

    ratings:Number,
},

    { timestamps: true })



module.exports = mongoose.model('book2', Book2Schema)