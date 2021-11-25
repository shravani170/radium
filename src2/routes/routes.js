const express = require('express')
const router = express.Router();

const weather=require('../controllers/weatherControllers')

router.get("/getWeather",weather.getWeather)
router.get("/getWeatherOfLondon",weather.getWeatherOfLondon)
router.get("/getCityTemprature",weather.getCityTemprature)
module.exports = router;
