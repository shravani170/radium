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
    if( !isValid(logoLink)) {
      res.status(400).send({status: false, message: `URL should be a valid URL address`});
      return;
  }


      const savedCollgeData = {name,fullName,logoLink}
      let savedCollge = await collegeModal.create(savedCollgeData);  
      return res.status(201).send({ status: true, msg: savedCollge });
    
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

const getInters = async function (req, res) {
  try{
  res.setHeader('Access-Control-Allow-Origin','*')
  const collegeName = req.query.collegeName;
  if (!collegeName) {
    res.status(400).send({ status: false, message: ' Please provide college Name ' });
    return;
  }
  let collegeDetail = await collegeModal.findOne({name:collegeName});
  if(!collegeDetail){
    res.status(400).send({status: false,message : "Invalid request parameters"})
    return 
  }
  if(collegeDetail.isDeleted==true){
    res.status(400).send({status:false,message:"college is not exist"})
  }
  const collegeId = collegeDetail._id
  const  interests =await intersControllers.find({ collegeId:collegeId  }).select({_id:1,name:1,email:1,mobile:1});
    const {name,fullName,logoLink}=collegeDetail
    const data={name,fullName,logoLink,interests}
    return res.status(200).send({ status: true,  collegeDetails:data});
}catch(err){
  res.status(500).send({status:false,message:err.message})
}

  
  
}

module.exports.creatCollege = creatCollege;
module.exports.getInters = getInters;