
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    user_name: {

        type: String,

        required: true,
        unique: true

    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pasword: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},

    { timestamps: true })


module.exports = mongoose.model('user', userSchema)