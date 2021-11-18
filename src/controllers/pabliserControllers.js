const pabliser_modal = require("../models/pabliserModels")
const mongoose = require("mongoose")

const pabliser = async function (req, res) {
    const pabliser = req.body
    let savedPabliser = await pabliser_modal.create(pabliser)
    res.send({ msg: savedPabliser })
}

module.exports.pabliser = pabliser