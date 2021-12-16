const express = require('express');
const router = express.Router();

const writerController= require("../controllers/writerControllers.js")
const bookController= require("../controllers/bookControllers.js")
const reviewController= require("../controllers/reviewControllers.js")



router.post("/writer/register", writerController.creatWriter)
router.post("/books",bookController.bookCreation)
router.post("/books/:bookId/review",reviewController.reviewData)

module.exports = router;