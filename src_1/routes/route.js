const express = require('express');
const router = express.Router();
const UserModel= require("../models/userModel")

const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookcontroller")

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/createNewBook',BookController.createNewBook  );//separate our logic from api listing (clearity of code)
router.get('/bookList',BookController.allBooklist  );
router.post('/getParticularBook',BookController.ParticularBook);
router.post('/getBooksInYear',BookController.yearDetails);
router.get('/getXINBooks',BookController.priceDetails);
router.get('/getRandombooks',BookController.randomBooks);
module.exports = router;
