const express = require('express');
const router = express.Router();

const writerController= require("../controllers/writerControllers.js")



router.post("/writer/register", writerController.creatWriter)


module.exports = router;