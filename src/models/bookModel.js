const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
       
        name:String,
        author_Id:{type: Number, required:true,ref:"author"},
        price:Number,
        ratings:Number   

 }, { timestamps: true }  
)
module.exports = mongoose.model('Books1', bookSchema)



