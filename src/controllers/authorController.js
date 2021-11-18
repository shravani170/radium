
const authorModel = require("../models/authorModel.js")
const bookModel = require("../models/bookModel.js")
const bookController = require("./bookController")


const getAuthorData = async function (req, res) {
    var data = req.body
    let savedData = await authorModel.create(data)
    res.send({ msg: savedData })
}

//List out the books written by Chetan Bhagat
const getChetanData = async function (req, res) {
let allBook = await authorModel.find({author_name:"Chetan Bhagat"})
let res1 = await bookModel.find({author_Id:allBook[0].author_Id})
    res.send({  res1 })
}



module.exports.getAuthorData = getAuthorData
module.exports.getChetanData = getChetanData

