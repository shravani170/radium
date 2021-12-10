const mongoose = require('mongoose')

const intersSchema = new mongoose.Schema({


    name: {type:String,required:true},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }, message: 'Please fill a valid email address', isAsync: false
        }, 
    },
    mobile: {type:Number,
             unique:true,
             require:"mobile number is required",
             trim:true,
             validator:{
                 validator:function(mobile){
                     return  /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile);
                 }, message: 'Please fill a valid mobile number', isAsync: false
             }
        }, 
    collegeId: {type: mongoose.Schema.Types.ObjectId, ref: 'college'}, 
    isDeleted: {type:Boolean, default: false}

}, { timestamps: true })

module.exports = mongoose.model('interndbs', intersSchema)