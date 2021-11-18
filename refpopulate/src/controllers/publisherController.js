const publisherModel= require("../models/publisherModel.js")

const createPublisher= async function (req, res) {
    var publisherData= req.body
    let savedPublisher= await publisherModel.create(publisherData)
    res.send({msg: savedPublisher })    
}


// const getAuthors= async function (req, res) {
//     let allAuthors= await authorModel.find()
//     res.send({data: allAuthors})
// }

module.exports.createPublisher= createPublisher
//module.exports.getAuthors= getAuthors