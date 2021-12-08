const collegeModel = require('../models/collegeModel')
const isValid = function (value) {//fields like name,fullname,loginlink cant be empty
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {//body should not be empty.
    return Object.keys(requestBody).length > 0
}
const registerCollege = async function (req, res) {
    try {
        let data = req.body
        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }
        const { name, fullName, logoLink } = data;
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'college name is required' })
            return
        }
        let isName = await collegeModel.findOne({ name }); // unique
        if (isName) {
            res.status(400).send({ status: false, message: `${name} college  already registered` })
            return
        }
        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: 'full name is required' })
            return
        }
        let isFullName = await collegeModel.findOne({ fullName }); // {email: email} object shorthand property
        if (isFullName) {
            res.status(400).send({ status: false, message: `${fullName} college  already registered with name ${isFullName.name}` })
            return
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: `logo is required` })
            return
        }
        if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink))) {
            res.status(400).send({ status: false, message: `logo should be a valid link` })
            return
        }
        let college = await collegeModel.create(data)
        res.status(201).send({ 'registered college:': college })//201 creation of data
    }
    catch (err) {
        res.status(500).send({ 'msg:': err })
    }
}
module.exports.registerCollege = registerCollege