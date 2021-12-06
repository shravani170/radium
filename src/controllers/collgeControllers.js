const collegeModal = require('../modal/collegeModal')
const intersControllers = require("../modal/intersModal")

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidRequestBody = function (college) {
  return Object.keys(college).length > 0
}

const creatCollege = async function (req, res) {
  try {

    const college = req.body
    if (!isValidRequestBody(college)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' });
      return;
    }
    const { name, fullName, logoLink } = college

    if (!isValid(name)) {
      res.status(400).send({ status: false, message: 'College name is required' });
      return;
    }

    if (!isValid(fullName)) {
      res.status(400).send({ status: false, message: 'Full name is required' });
      return;
    }
    if( /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/.test(logoLink)) {
      res.status(400).send({status: false, message: `URL should be a valid URL address`});
      return;
  }


      const savedCollgeData = {name,fullName,logoLink}
      let savedCollge = await collegeModal.create(savedCollgeData);   //saving auther details in "Authors" collection
      return res.status(201).send({ status: true, msg: savedCollge });
    
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

const getInters = async function (req, res) {
  const collegeName = req.query.collegeName;
  if (!isValidRequestBody(collegeName)) {
    res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college Name' });
    return;
  }
  let collegeDetail = await collegeModal.findOne({name:collegeName});
  const collegeId = collegeDetail._id
  const  interests =await intersControllers.find({ collegeId:collegeId  });
   const {name,fullName,logoLink}=collegeDetail
   const data={name,fullName,logoLink,interests}

  return res.status(200).send({ status: true,  collegeDetails:data});
  
}

module.exports.creatCollege = creatCollege;
module.exports.getInters = getInters;