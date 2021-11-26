const express = require('express')
const router = express.Router();

const cripto = require('../controllers/criptoControllers') 

router.post("/cripto", cripto.getCripto)
module.exports = router;
