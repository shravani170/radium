const mongoose = require('mongoose')

const pabliserScehma = new mongoose.Schema({

    pabliser_name: String,

    headQuarter: String

}, { timestamps: true })

module.exports = mongoose.model('pabliser', pabliserScehma)