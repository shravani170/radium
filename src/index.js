const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();
var dateTime = require('node-datetime');
const midGlb = function(req, res, next){
    var dt =  dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log(formatted, ",", req.ip, ",", req.originalUrl);
    next()
    }
    app.use(midGlb)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/balajiyadav?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);
//var dateTime = require('moment');


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});