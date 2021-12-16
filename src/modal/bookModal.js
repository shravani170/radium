const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({

    title:{ type:String, require:true, unique:true},

    excerpt:{ type:String, require:true,},

    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'writerDB'},

    ISBN:{ type:String, required:true,unique:true},

    category:{ type:String, require:true},

    subCategory:{ type:String, require:true},

    reviews:{ type:Number, default:0},

    deletedAt:{ type: Date, default: null},

    isDeleted:{ type:Boolean, default:false},

    releasedAt:{ type:Date, default:null},

}, { timestamps: true })

module.exports = mongoose.model('bookDB', bookSchema)