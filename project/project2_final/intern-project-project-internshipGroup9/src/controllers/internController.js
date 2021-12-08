const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')
const isValid = function (value) {//fields like name,mobile,email,collegename cant be empty
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {//body should not be empty.
    return Object.keys(requestBody).length > 0
}
const registerIntern = async function (req, res) {
    try {
        let data = req.body
        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
            return
        }
        const { name, mobile, email, collegeName } = data;
        const isDeleted = data.isDeleted ? data.isDeleted : false//if isDelete is true then true value otherwise false
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'intern name is required' })
            return
        }
        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, message: 'college name is required' })
            return
        }
        const isCollege = await collegeModel.findOne({ name: collegeName }); // {email: email} object shorthand property

        if (!isCollege) {
            res.status(400).send({ status: false, message: `${collegeName} doesnot exist` })
            return
        }
        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: 'mobile is required' })
            return
        }
        if (!(/^[6-9]\d{9}$/gi.test(mobile))) {
            res.status(400).send({ status: false, message: `mobile should be a valid mobile number` })
            return
        }
        const isMobileAlreadyUsed = await internModel.findOne({ mobile }); // {email: email} object shorthand property

        if (isMobileAlreadyUsed) {
            res.status(400).send({ status: false, message: `${mobile} mobile is already registered` })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        const isEmailAlreadyUsed = await internModel.findOne({ email }); // {email: email} object shorthand property
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }
        let college = await collegeModel.findOne({ name: collegeName })
        console.log(college)
        let collegeId = college._id
        let intern = {
            'name': data.name,
            'mobile': data.mobile,
            'email': data.email,
            'collegeId': collegeId,
            'isDeleted': isDeleted
        }
        let saved = await internModel.create(intern)
        res.status(201).send({ 'status': true, 'data': saved })
    } catch (err) {
        res.status(500).send({ "status": false, 'message': err })
    }
}


const internList = async function (req, res) {
    try {
        let college = req.query
        if (!isValidRequestBody(college)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details' })
            return
        }
        if (!isValid(college.collegeName)) {
            res.status(400).send({ status: false, message: 'please enter college details' })
            return
        }
        let college_data = await collegeModel.findOne({ name: college.collegeName, isDeleted: false })
        if (!isValid(college_data)) {
            res.status(400).send({ status: false, message: 'college doesnot exist' })
            return
        }
        let id = college_data._id
        let interns = await internModel.find({ collegeId: id, isDeleted: false }).select({ name: 1, mobile: 1, email: 1 })
        let collegeDetails = {
            name: college_data.name,
            fullName: college_data.fullName,
            logoLink: college_data.logoLink,
            interests: interns
        }
        if (interns.length == 0) {
            collegeDetails.interests = "no interns present"
        }
        res.status(200).send({ "status":true,'data': collegeDetails })//return data
    }
    catch (err) {
        res.status(500).send({ 'err': err })
    }
}
module.exports.registerIntern = registerIntern
module.exports.internList = internList