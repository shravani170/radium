const jwt = require("jsonwebtoken")

const Auth = async function (req, res, next) {
    try {

   const authHeader= req.headers['authorization']
   const bearerToken=authHeader.split(' ')
   const token=bearerToken[1]
        if (!token) {
            res.status(401).send({ status: false, Message: 'Mandatory authentication token is missing.' })
        } else {
            let decodedtoken = jwt.verify(token, 'project5')
            if (decodedtoken) {
                req.user = decodedtoken//user id present in token
                //  console.log(decodedtoken)
                next()
            }
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




module.exports.Auth = Auth