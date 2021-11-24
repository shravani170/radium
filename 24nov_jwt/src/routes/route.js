const express = require('express');
const router = express.Router();
//const UserModel= require("../models/userModel")
const loginMw = require("../middleWare/loginMw")
const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel.js")

const UserController= require("../controllers/userController")


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/createUser',  UserController.createUser  );
router.post('/login',  UserController.login  );
router.get('/user/:userId', loginMw.tokenCheck, UserController.getDetails  );
router.put('/user/:userId',loginMw.tokenCheck,  UserController.updateUser  );


module.exports = router;