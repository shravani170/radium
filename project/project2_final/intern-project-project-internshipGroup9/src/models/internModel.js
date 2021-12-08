const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
            }, message: 'Please fill a valid email address', isAsync: false
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (mobile) {
                return /^[6-9]\d{9}$/gi.test(mobile)
            }, message: 'Please fill a valid mobile number', isAsync: false
        }
    },
    collegeId: {
        type: ObjectId,
        ref: 'college'
    },
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true })
module.exports = mongoose.model('intern', internSchema)