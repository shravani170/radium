const writerModal = require('../modal/writerModal')


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidRequestBody = function (writer) {
  return Object.keys(writer).length > 0
}

const creatWriter = async function (req, res) {
  try {

    const writer = req.body
    if (!isValidRequestBody(writer)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide writer details' });
      return;
    }
    const { title,name,phone,email,password}=writer
    const isNameAlreadyUsed = await writerModal.findOne({ phone:phone,email:email,password:password });
            if (isNameAlreadyUsed) {
                return res.status(403).send({ status: false, message: 'writer  already  exist' });
            }
    const samePhone=await writerModal.findOne({ phone:phone });
    if (samePhone) {
        return res.status(403).send({ status: false, message: 'phone number   already  exist,use different phone number' });
    }
    const sameEmail = await writerModal.findOne({ email:email });
    if (sameEmail) {
        return res.status(403).send({ status: false, message: 'email already  exist,use different email' });
    }
    const samePassword=await writerModal.findOne({ password:password });
    if (samePassword) {
        return res.status(403).send({ status: false, message: 'epassword already  exist,use different password' });
    }
    const {address}=writer
    if (!isValid(title)) {
      res.status(400).send({ status: false, message: 'Title  is required' });
      return;
    }

    if (!isValid(name)) {
      res.status(400).send({ status: false, message: 'Name is required' });
      return;
    }
    if( !isValid(phone)) {
      res.status(400).send({status: false, message: `Phone number is required`});
      return;
  }
  if( !isValid(email)) {
    res.status(400).send({status: false, message: `Email is required`});
    return;
}
if(!(password.length>=8 && password.length<=15)) {
  res.status(400).send({status: false, message: `invalid Password `});
  return;
}
if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {         //using regex for validating for email
  res.status(404).send({ status: false, message: `Email should be a valid email address` })
  return
}
if (!( /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {                //using regex for validating for mobile 
  res.status(404).send({ status: false, message: 'Mobile number should be a valide number' })
  return
}
 let savedWriterData=0
      if(address===0){
        savedWriterData = {title,name,phone,email,password}
      }else{
       savedWriterData = {title,name,phone,email,password,address}
      }

       let savedWriter = await writerModal.create(savedWriterData);  
       return res.status(201).send({ status: true,message: 'Success', data: savedWriter });
    
   } catch (error) {
     res.status(500).send({ status: false, message: error.message });
   }
 }

module.exports.creatWriter = creatWriter