const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// const midGlb= function (req, res, next) {
//     console.log("Hi I am a GLOBAL middleware");
//     //logic
//     next()    
// }
const assignmentMiddleware=function(req,res,next){
    var currentDate=new Date();
    var datetime=currentDate.getDate()+" "
                 +currentDate.getMonth()+" "
                 +currentDate.getFullYear()+" "
                 +currentDate.getHours()+" "
                 +currentDate.getMinutes()+" "
                 +currentDate.getSeconds();
     let ip=req.ip
     let url=req.originalUrl
     console.log(`${datetime},${ip},${url}`)            
}
app.use(assignmentMiddleware)

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/pkDB?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb running and connected'))
    .catch(err => console.log(err))





    
app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});