
const express = require('express');

const router = express.Router();

const authorController = require("../controllers/authorsController")

const book2Controller = require("../controllers/NewbookControllers")

const pabliserController = require("../controllers/pabliserControllers")




router.post('/createAuthor', authorController.createAuthor);

router.post('/createBook2', book2Controller.createBook2);

router.post('/createPabliser', pabliserController.pabliser);

router.get('/getAllBook', book2Controller.getAllBook);

module.exports = router;