const product_modal = require("../models/prouductDocument")

const mongoose = require("mongoose")

const prouduct1 = async function (req, res) {

    const prouduct = req.body

    let savedPabliser = await product_modal.create(prouduct)

    res.send({ msg: savedPabliser })
}

module.exports.prouduct1 = prouduct1