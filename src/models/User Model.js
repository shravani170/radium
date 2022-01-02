const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({

    fname: {type: String,required: true,trim:true},
    lname: {type: String,required: true,trim:true},
    email: { type: String,required: true,unique: true},
    profileImage:{type:String,required:true},
    phone:{type:String,trim: true,required:`Phone Number is required`,unique:true},
    password:{type: String,required: true,},
    address:{
        shipping: {
        street:{type:String,required:true},
        city:{type:String,required:true},
        pincode:{type:String,required:true}
    },
    billing:{
        street:{type:String,required:true},
        city:{type:String,required:true},
        pincode:{type:String,required:true}
    }
},
createdAt:{type: Date,default: Date.now},
updatedAt:{type:Date, default:Date.now}

},{ timestamps: true })


module.exports = mongoose.model('UserDBphase1', UserSchema)