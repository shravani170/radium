const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

   user_name: {

      type: String,

      required: true

   },
   balance:{type:Number,required:true},
   age: Number,
   
   address: String,

   gender: {type: String,enum: ['male','female','LGBTQ'
]},

   freeAppUser:false
},

   { timestamps: true })


module.exports = mongoose.model('user', userSchema)