const express = require('express');
const router = express.Router();
const autherModel= require("../models/autherModel")
const Bookmodel=require("../models/Bookmodel")
const autherController= require("../controllers/autherController")
const bookController= require("../controllers/bookController")


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/addThisBook',bookController.addThisBook );//add bookdata
router.post('/addThisauther',autherController.addThisauther);//add auther data
router.get('/getchetanBhagatBooks',bookController.getchetanBhagatBooks);//to get chetanbhagatbook
//find the author of “Two states” and update the book price to 100;
 // Send back the author_name and updated price in response
//router.get('/updatePrice',bookController.updatePrice )
//Find the books which costs between 50-100(50,100 inclusive) and respond back with 
//the author names of respective books
//router.get('/bookInRange',bookController.bookInRange)
module.exports = router;
