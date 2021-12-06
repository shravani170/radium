const express = require('express');
const router = express.Router();

const collegeController= require("../controllers/collgeControllers.js")
const intersControllers = require("../controllers/intersControllers")


router.post("/functionup/colleges", collegeController.creatCollege)
router.post("/functionup/interns",intersControllers.creatInters)
router.get("/functionup/collegeDetails",collegeController.getInters)

module.exports = router;