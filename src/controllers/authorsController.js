
const AuthorModel = require("../models/authorsModal.js")

const mongoose = require("mongoose")


const createAuthor = async function (req, res) {

    const Author = req.body

    let savedAuthor = await AuthorModel.create(Author)
    
    res.send({ msg: savedAuthor })
}


module.exports.createAuthor = createAuthor