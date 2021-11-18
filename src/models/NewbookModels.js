
const mongoose = require('mongoose')


const Book2Schema = new mongoose.Schema({

    name:String,

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myAuthor'

    },

    price:Number,

    ratings:Number,
    pabliser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'pabliser',
        required:true
    }
},

    { timestamps: true })



module.exports = mongoose.model('myBook', Book2Schema)