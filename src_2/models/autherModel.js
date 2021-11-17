const mongoose=require("mongoose")

 const autherSchema=new mongoose.Schema({
    auther_id: {
        type: Number,
        required: true
    },
    author_name: String,
    age:Number, 
   address:String

    // isIndian: Boolean,
    // parentsInfo : { motherName: String, fatherName: String , siblingName: String },
    // cars: [ String ]

},) 

module.exports=mongoose.model('Autherdata',autherSchema)