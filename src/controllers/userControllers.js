
const AuthorModel = require("../models/userDocument.js")

const mongoose = require("mongoose")


const createUser = async function (req, res) {

    const User = req.body

    let savedAuthor = await AuthorModel.create(User)
    
    res.send({ msg: savedAuthor })
}


module.exports.createUser = createUser