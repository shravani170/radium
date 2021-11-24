let captureInfo = function (req, res, next) {
    // let acceptHeaderValue = req.headers['accept']
    // req.headers['batch']='Radium'
    // console.log('Global middleware called')
    // res.send('Global middleware called')
    let captureInfo = req.headers['isfreeapp']
    //console.log(captureInfo);
    if(!captureInfo){
        return res.send({message:"isFeeApp in not presnt in "})
    }
    next()
}
module.exports.captureInfo = captureInfo