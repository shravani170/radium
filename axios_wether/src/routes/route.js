const express = require('express');
const router = express.Router();

const weatherController = require("../controllers/weatherController")


router.get("/wether", weatherController.geteWeather)
router.get("/londonTemp",weatherController.getlondonTemp)
router.get("/sortedByTemp",weatherController.getsortedByTemp)



module.exports = router;