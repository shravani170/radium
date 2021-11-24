const jwt = require('jsonwebtoken')


const tokenCheck = function (req, res , next) {
    try{
    let token = req.headers['x-auth-token']
    if (!token) {
        res.status(401).send({status:false, message:"Mandatory authentication header missing"})
    }
    else{
        let decodedToken = jwt.verify(token, 'Radium')
        if (decodedToken) {
            req.user=decodedToken
            console.log("Token:-", decodedToken)
            next()
        }else {
            res.status(401).send({ status:false, msg:" the authentication is invalid"})
        }
    }
    }catch(error){
        res.status(500).send({status:false, message: error.message})
    } 
}

module.exports.tokenCheck = tokenCheck 