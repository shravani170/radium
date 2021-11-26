const express = require('express');
const router = express.Router();

const cryptoController= require("../controllers/cryptoController")


router.get("/getcoins", cryptoController.getcoins)




module.exports = router;